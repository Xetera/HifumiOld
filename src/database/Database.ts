import {createConnection, ConnectionOptions, Connection, getConnection, DeleteResult} from 'typeorm'
import {IORMConfig} from "./ormconfig.interface";
import gb from "../misc/Globals";
import {Environments} from "../events/systemStartup";
import {debug} from "../utility/Logging";
import {User} from "./models/user";
import {Guild} from "./models/guild";
import {GuildMember, Message, Guild as DiscordGuild, GuildAuditLogsFetchOptions} from "discord.js";
import {Macro} from "./models/macro";
import {Note} from "./models/note";
import {arrayFromValues} from "../utility/Util";
import 'reflect-metadata';
import * as fs from 'fs'
const rootConfig: IORMConfig = require('../../ormconfig.json');

export class Database {
    env: Environments;
    connectionString: string;
    conn: Connection;
    ready: boolean = false;
    welcomeMessages: {[id: string]: Message[]};
    constructor(url: string) {
        this.env = gb.ENV;
        this.connectionString = url;

        debug.info(`Logging into postgres in ${this.env === Environments.Development ? 'dev' : 'live'} mode.`, `Database`);
        this.connect(url).then(conn => {
            debug.info(`Logged into postgres`, `Database`);
            this.conn = conn;
            return this.crossCheck();
        }).then(() => {
            this.ready = true;
        })
    }

    public connect(url: string): Promise<Connection> {
        return this.ormConfig(url).then(() => {
            return createConnection({
                type: 'postgres',
                url: url,
                database: 'discord',
                entities: ['src/database/models/**/*.js'],
                migrations: ['src/database/migrations/**/*.js'],
                synchronize: /*false, */ this.env === Environments.Development,
                dropSchema: /*false, */ this.env === Environments.Development,
                cli: {
                    migrationsDir: 'migrations'
                },
                cache: {
                    type: 'redis',
                    duration: Infinity,
                    options: {
                        // TODO: Make this dynamic
                        host: this.env === Environments.Development ? 'localhost' : process.env.REDISCLOUD_URL,
                        port: 6379
                    }
                }
            }).catch(err => {
                debug.error(err, `Database`);
                return Promise.reject(err);
            });

        }).catch(err => {
            debug.error(err, `Database`);
            return Promise.reject(err);
        });
    }

    private ormConfig(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            rootConfig.url = url;
            fs.writeFile('ormconfig.json', JSON.stringify(rootConfig, null, '\t'), (err) => {
                if (err)
                    return reject();
                return resolve();
            });
        });
    }

    public async crossCheck(): Promise<void> {
        debug.silly(`Crosschecking database`, `Database`);
        const guilds = gb.instance.bot.guilds.array();
        for (let i in guilds) {
            const guild = guilds[i];
            await this.addGuild(guild);
            const users = guild.members.array();
            for (let i in users) {
                const user = users[i];
                await this.addMember(user);
                console.log(await this.getUser(user.guild.id, user.user.id))
            }
        }
        debug.silly(`Crosschecked db`,`Database`);
        return Promise.resolve();
    }

    public invalidateCache(table: string): Promise<void>{
        // always caching so we're force validating queryResultCache
        return this.conn.queryResultCache!.remove([table]);
    }

    public getUsers(guildId: string): Promise<User[]> {
        return this.conn.manager.find(User, {where: {guild_id: guildId}, cache: true});
    }

    public getUser(guildId: string, userId: string): Promise<User>  {
        return this.conn.manager.find(User, {where: {guild_id: guildId, id: userId}, cache: true}).then((r: User[]) => {
            if (r.length > 1) {
                debug.error(`Multiple instances of user ${userId} exists in the db.`, `Database`);
            }
            return r[0];
        }).catch((err: Error)=> {
            return Promise.reject(err);
        })
    }

    public getGuild(guildId: string): Promise<Guild> {
        return this.conn.manager.findOne(Guild, {where: {id: guildId}, cache: true}).then((r: any) => {
            console.log(r);
            if (!r)
                return Promise.reject('Guild not found');
            return r;
        }).catch((err: Error)=> {
            return Promise.reject(err);
        })
    }

    public getGuilds(): Promise<Guild[]>{
        return this.conn.manager.find(Guild, {cache: true});
    }

    public getMacros(guildId: string): Promise<Macro[]> {
        return this.conn.manager.find(Macro, {where: {guild_id: guildId}, cache: true}).then((r: Macro[]) => {
            return r;
        });
    }

    public getMacro(guildId: string, name: string): Promise<Macro|undefined> {
        return this.conn.manager.findOne(Macro, {where: {guild_id: guildId, macro_name: name}, cache: true});
    }

    public getMacroCount(guildId: string): Promise<number> {
        return this.getMacros(guildId).then((r: Macro[]) => {
            return r.length;
        });
    }

    public setPrefix(guildId: string, prefix: string) {
        if (prefix.length > 1) {
            return Promise.reject(`Prefix for ${guildId} must be a single character`);
        }
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.save(Guild, {id: guildId, prefix: prefix});
        }).catch(err => {
            debug.error(`Error getting guild`, `Database`);
            return Promise.reject(err);
        })
    }

    public getPrefix(guildId: string): Promise<string> {
        return this.getGuild(guildId).then((guild: Guild) => {
            return guild.prefix;
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    public addMember(target: GuildMember): Promise<Partial<User>> {
        return this.invalidateCache('users').then(() => {
            return this.conn.manager.save(User, {id: target.id, guild_id: target.guild.id});
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    public addGuild(guild: DiscordGuild): Promise<Partial<Guild>>{
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.save(Guild, {
                id: guild.id
            });
        }).catch(err => {
            return Promise.reject(err);
        })
    }

    public addMacro(message: Message, macroName: string, macroContent: string): Promise<Partial<Macro>> {
        return this.invalidateCache('macros').then(() => {
            return this.conn.manager.save(Macro, {
                creator_id: message.author.id,
                date_created: new Date(),
                guild_id: message.guild.id,
                macro_name: macroName,
                macro_content: macroContent
            });
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    public deleteMacro(guild: DiscordGuild, macroName: string): Promise<DeleteResult>{
        return this.conn.manager.delete(Macro, {macro_name: macroName, guild_id: guild.id});
    }

    public addNote(guild: DiscordGuild, caller: GuildMember, target: GuildMember, noteContent: string): Promise<Partial<Note>> {
        return this.invalidateCache('notes').then(() => {
            return this.conn.manager.save(Note, {
                guild_id: guild.id,
                staff_id: caller.id,
                target_id: target.id,
                staff_name: caller.user.username,
                guild_name: guild.name,
                note_date: new Date(),
                note_content: noteContent
            });
        })
    }

    public deleteNote(guild: DiscordGuild, noteId: string): Promise<DeleteResult> {
        return this.invalidateCache('notes').then(() => {
            return this.conn.createQueryBuilder()
                .delete()
                .from(Note)
                .where('note_id = :note_id AND guild_id = :guild_id', {note_id: noteId, guild_id: guild.id})
                .execute();
        })
    }

    public getNotes(memberId: string, guildId: string){
        return this.conn.manager.find(Note, {where: {target_id: memberId, guild_id: guildId}, cache: true});
    }

    public cacheWelcomeMessage(member: GuildMember, welcomeMessage: Message) {
        const target = this.welcomeMessages[member.guild.id];
        if (!target.length){
            this.welcomeMessages[member.guild.id] = [welcomeMessage];
            return;
        }
        this.welcomeMessages[member.guild.id].push(welcomeMessage);
    }

    public unCacheWelcomeMessage(member: GuildMember): Message|undefined {
        const target = this.welcomeMessages[member.guild.id];
        if(!target.length){
            const err = `A welcome message in ${member.guild.id} could not be removed because the list is empty`
            debug.error(err, `Database`);
        }
        return target.find(t => t.member.id === member.id);

    }

    public setAllowGuildInvites(guildId: string, state: boolean): Promise<Partial<Guild>> {
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.save(Guild, {id: guildId, allows_invites: state});
        }).catch(err => {
            return Promise.reject(err);
        })
    }

    public getAllowGuildInvites(guildId: string): Promise<boolean> {
        return this.getGuild(guildId).then((r: Guild) => {
            return r.allows_invites;
        }).catch(err => {
            return Promise.reject(err);
        })
    }

    public setWelcomeChannel(guildId: string, channelId: string): Promise<Partial<Guild>> {
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.save(Guild, {id: guildId, welcome_channel: channelId});
        }).catch(err => {
            return Promise.reject(err);
        })
    }

    public setLogsChannel(guildId: string, channelId: string): Promise<Partial<Guild>> {
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.save(Guild, {id: guildId, logs_channel: channelId});
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    public setWarningsChannel(guildId: string, channelId: string): Promise<Partial<Guild>> {
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.save(Guild, {id: guildId, warnings_channel: channelId});
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    public setChatChannel(guildId: string, channelId:string): Promise<Partial<Guild>> {
        return this.invalidateCache('guildss').then(() => {
            return this.conn.manager.save(Guild, {id: guildId, chat_channel: channelId});
        }).catch(err => {
            return Promise.reject(err);
        })
    }

    public getWelcomeChannel(guildId: string): Promise<string> {
        return this.getGuild(guildId).then((r: Guild) => {
            return r.welcome_channel;
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    public getLogsChannel(guildId: string): Promise<string> {
        return this.getGuild(guildId).then((r: Guild) => {
            return r.logs_channel;
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    public getWarningsChannel(guildId: string): Promise<string> {
        return this.getGuild(guildId).then((r: Guild) => {
            return r.warnings_channel;
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    public getChatChannel(guildId: string): Promise<string> {
        return this.getGuild(guildId).then((r: Guild) => {
            return r.chat_channel;
        }).catch(err => {
            return Promise.reject(err);
        })
    }

    public setUserIgnore(member: GuildMember, state: boolean): Promise<Partial<User>> {
        return this.invalidateCache('users').then(() => {
            return this.conn.manager.save(User, {guild_id: member.guild.id, id: member.id, ignoring: state});
        }).catch(err => {
            return Promise.reject(err);
        })
    }

    public getUserIgnore(member: GuildMember): Promise<boolean> {
        return this.getUser(member.guild.id, member.id).then((r: User) => {
            if (!r)
                return true;
            return r.ignoring;
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    public setCommandHints(guildId: string, state: boolean): Promise<Partial<Guild>> {
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.save(Guild, {id: guildId, hints: state});
        })

    }

    public getCommandHints(guildId: string) {
        return this.getGuild(guildId).then((r: Guild) => {
            return r.hints;
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    public getReactions(guildId: string){
        return this.getGuild(guildId).then((r: Guild) => {
            return r.reactions;
        }).catch(err => {
            return Promise.reject(err);
        })
    }

    public incrementInviteStrike(member: GuildMember){
        const memberIdentity = {
            id: member.id,
            guild_id: member.guild.id
        };

        return this.conn.manager.increment(User, memberIdentity, 'invite_strikes', 1)
            .catch(err => Promise.reject(err))
            .then(() => {
                return this.conn.manager.findOne(User, memberIdentity)
            }).then((r: User|undefined) => {
                if (!r){
                    return Promise.reject(`Invite strike of user with ID ${member.id} could not be incremented, user not found.`);
                }
                return Promise.resolve(r.invite_strikes);
            }).catch(err =>  Promise.reject(err));
    }

    public setReactions(guildId: string, state: boolean){
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.save(Guild, {
                id: guildId,
                reactions: state
            });
        }).catch(err => {
            return Promise.reject(err);
        })
    }
}

