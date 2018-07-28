import {
    createConnection,
    Connection,
    DeleteResult,
    InsertResult,
    UpdateResult
} from 'typeorm'
import {IORMConfig} from "./ormconfig.interface";
import {Environments} from "../events/systemStartup";
import {debug} from "../utility/Logging";
import {User} from "./models/user";
import {Guild, LoggingChannelType} from "./models/guild";
import {GuildMember, Message, Guild as DiscordGuild} from "discord.js";
import {Macro} from "./models/macro";
import {Note} from "./models/note";
import * as fs from 'fs'
import {Infraction} from "./models/infraction";
import moment = require("moment");
import {MutedUser} from "./models/mutedUser";
import {Suggestion} from "./models/suggestion";
import {IgnoredChannel} from "./models/ignoredChannel";
import {IDatabase, IWelcomeMessage} from "../interfaces/injectables/datbase.interface";
import {handleFatalErrorGracefully} from "../handlers/process/fatal";
import {Inject, Singleton} from "typescript-ioc";
import {IClient} from "../interfaces/injectables/client.interface";
const rootConfig: IORMConfig = require('../../ormconfig.json');

@Singleton
export class Database extends IDatabase {
    connectionString: string;
    conn: Connection;
    @Inject client: IClient;
    /**
     * Tells when the database is ready for other instances to query
     * @type {boolean}
     */
    ready: boolean = false;
    welcomeMessages: {[id: string]: IWelcomeMessage[]} = {};
    constructor() {
        super();
        const connString: string | undefined = process.env['POSTGRES_URL'] || process.env['DATABASE_URL'];
        if (!connString){
            const error: Error = new Error(
                "Missing 'POSTGRES_URL' or 'DATABASE_URL' environment variable " +
                "this bot cannot run without a postgres connection. Make sure you've properly " +
                "configured your environment variables or set up a .env file with the required info."
            );
            handleFatalErrorGracefully(error);
            return;
        }
        this.connectionString = connString;
        debug.info(`Logging into postgres in ${this.client.env === Environments.Development ? 'dev' : 'live'} mode.`, `Database`);
        this.connect(this.connectionString).then(conn => {
            debug.info(`Logged into postgres`, `Database`);
            this.conn = conn;
            return this.sync();
        }).then(() => {
            this.ready = true;
        }).catch(err => {
            return handleFatalErrorGracefully(err);
        });
    }


    /**
     * Connects to postgres, returns connection on successful connections
     * @param {string} url
     * @returns {Promise<Connection>}
     */
    private connect(url: string): Promise<Connection> {
        debug.silly(`Connecting to postgres on url ${url}`, `Database`);
        return this.ormConfig(url).then(() => {
            return createConnection({
                type: 'postgres',
                url: url,
                entities: ['src/database/models/**/*.js'],
                migrations: ['src/database/migrations/**/*.js'],
                    // DO NOT TURN THESE ON FOR PRODUCTION
                    // I'M SERIOUS DON'T DO IT

                    synchronize: this.client.env === Environments.Development,
                    //dropSchema:  this.env === Environments.Developmentclient.envclient.envclient.env DUDE I'M 100% SERIOUSLY RN I'LL GET SUPER MAD OK
                cli: {
                    migrationsDir: 'migrations'
                },
                cache: {
                    type: 'redis',
                    duration: Infinity,
                    options: {
                        // setting via gb.ENV creates problems with docker
                        url: process.env.REDISCLOUD_URL ? process.env.REDISCLOUD_URL  : 'redis://localhost:6379'
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

    /**
     * Sets up the ormconfig.json file in the root folder.
     * We need this hack because of migrations which can only be set up
     * using these settings or environment variables which don't support URL types
     * @param {string} url
     * @returns {Promise<void>}
     */
    private ormConfig(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            rootConfig.url = url;
            fs.writeFile('ormconfig.json', JSON.stringify(rootConfig, null, '\t'), (err) => {
                if (err)
                    return reject(err);
                return resolve();
            });
        });
    }

    /**
     * Syncs the database with currently
     * @returns {Promise<void>}
     */
    private async sync(): Promise<void> {
        debug.silly(`Crosschecking database`, `Database`);
        for (const [,guild] of this.client.guilds) {
            // setting each server
            this.welcomeMessages[guild.id] = [];

            await this.addGuild(guild);

            const g = await guild.fetchMembers();
            await this.addMembers(g.members.array());
        }
        debug.silly(`Crosschecked database, bot fully online`,`Database`);
    }

    private invalidateCache(table: string): Promise<void>{
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
        return this.conn.manager.findOne(Guild, {where: {id: guildId}, cache: true}).then((r: Guild | undefined) => {
            if (!r)
                return Promise.reject('Guild not found');
            return Promise.resolve(r);
        }).catch((err: Error)=> {
            return Promise.reject(err);
        });

    }
    public async getGuildColumn<T extends keyof Guild>(guildId: string, column: T): Promise<Guild[T] | undefined>{
        let result = await this.conn.manager.findOne(Guild, {id: guildId});
        if (!result){
            return;
        }
        return result[column];
    }

    public async setGuildColumn<T extends keyof Guild>(guildId: string | undefined, column: T, value: Guild[T]){
        await this.invalidateCache('guilds');
        return this.conn.manager.save(Guild, {id: guildId, [column]: value})
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

    public getPrefix(guildId: string): Promise<string> {
        return this.getGuild(guildId).then((guild: Guild) => {
            return guild.prefix;
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    public addMember(target: GuildMember): Promise<Partial<User>> {
        return this.invalidateCache('users').then(() => {
            return this.conn.manager.save(User, {
                id: target.id,
                guild_id: target.guild.id
            });
        }).catch(async(err: Error)=> {
            if (err.message.indexOf('duplicate key') >= 0){
                await this.conn.manager.createQueryBuilder()
                    .update(User)
                    .set({invite_strikes: 0})
                    .where(`id = :id AND guild_id = :guild_id`, {id: target.id, guild_id: target.guild.id})
                    .execute();
                return Promise.resolve(<Partial<User>> {
                    id: target.id,
                    guild_id: target.id,
                    invite_strikes: 0
                });
            }
            return Promise.reject(err);
        });
    }

    public addMembers(targets: GuildMember[]): Promise<InsertResult> {
        const final = targets.reduce((a: Partial<User>[], t: GuildMember) => {
            a.push({id: t.id, guild_id: t.guild.id});
            return a;
        }, <Partial<User>[]> []);

        return this.invalidateCache('users').then(() => {
            return this.conn.createQueryBuilder()
                .insert()
                .into(User)
                .values(final)
                .onConflict(`("id", "guild_id") DO NOTHING`)
                .execute();
        })
    }

    public addGuild(guild: DiscordGuild): Promise<Partial<Guild>>{
        // setting welcome messages to empty array
        this.welcomeMessages[guild.id] = [];
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.save(Guild, {
                name: guild.name,
                id: guild.id
            });
        }).catch(err => {
            return Promise.reject(err);
        })
    }

    public addMacro(message: Message, macroName: string, macroContent?: string, macroLinks?: string[]): Promise<Partial<Macro>> {
        if (!macroContent && !macroLinks){
            return Promise.reject('Macro to be saved missing both content and links')
        }
        return this.invalidateCache('macros').then(() => {
            return this.conn.manager.save(Macro, {
                creator_id: message.author.id,
                date_created: new Date(),
                guild_id: message.guild.id,
                macro_name: macroName,
                macro_content: macroContent,
                macro_links: macroLinks
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
        });
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

    public cacheWelcomeMessage(member: GuildMember, welcomeMessage: Message)    {
        this.welcomeMessages[member.guild.id].push({userId: member.id, message: welcomeMessage});
    }

    public unCacheWelcomeMessage(member: GuildMember): Message | undefined {
        const target = this.welcomeMessages[member.guild.id];
        if(!target || !target.length){
            const err = `A welcome message in ${member.guild.id} could not be removed because the list is empty`
            return void debug.error(err, `Database`);
        }
        const out = target.find(t => t.userId === member.id);
        return out ? out.message : undefined;
    }

    public setWelcomeChannel(guildId: string, channelId: string | undefined): Promise<Partial<Guild>> {
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.save(Guild, {id: guildId, welcome_channel: channelId});
        }).catch(err => {
            return Promise.reject(err);
        })
    }

    public removeWelcomeChannel(guildId: string){
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.createQueryBuilder()
                .update(Guild)
                .set({welcome_channel: null})
                .where(`id = :id`, {id: guildId})
                .returning('*')
                .execute();
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    public setLogsChannel(guildId: string, channelId: string | undefined): Promise<Partial<Guild>> {
        return this.getGuild(guildId).then((r: Guild) => {
            if (!r.warnings_channel) {
                return void this.setWarningsChannel(guildId, channelId);
            }
        }).then(() => {
            return this.invalidateCache('guilds');
        }).then(() => {
            return this.conn.manager.save(Guild, {id: guildId, logs_channel: channelId});
        }).catch((err: Error) => {
            return Promise.reject(err);
        });
    }

    public removeLogsChannel(guildId: string){
        return this.conn.createQueryBuilder()
            .update(Guild)
            .set({logs_channel: null})
            .where(`id = :id`, {id: guildId})
            .returning('*')
            .execute();
    }

    public setWarningsChannel(guildId: string, channelId: string | undefined): Promise<Partial<Guild>> {
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.save(Guild, {id: guildId, warnings_channel: channelId});
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    public setChatChannel(guildId: string, channelId:string | undefined): Promise<Partial<Guild>> {
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.save(Guild, {id: guildId, chat_channel: channelId});
        }).catch(err => {
            return Promise.reject(err);
        })
    }

    public setUserIgnore(member: GuildMember, state: boolean): Promise<UpdateResult> {
        return this.invalidateCache('users').then(() => {
            // return this.conn.manager.save(User, {guild_id: member.guild.id, id: member.user.id, ignoring: state});
            return this.conn.manager.createQueryBuilder()
                .update(User)
                .set({ignoring: state})
                .where(`guild_id = :guild_id AND id = :id`, {guild_id: member.guild.id, id: member.id})
                .execute();
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    public isUserIgnored(member: GuildMember): Promise<boolean> {
        return this.getUser(member.guild.id, member.id).then((r: User) => {
            return r.ignoring;
        }).catch(err => {
            debug.error(`User ${member.user.username} in guild ${member.guild.id} isn't saved in the Database`, `Database`);
            return Promise.reject(err);
        });
    }

    public getIgnoredUsers(guildId: string): Promise<User[]>{
        return this.getUsers(guildId).then((r: User[]) => {
            return r.filter(user => user.ignoring);
        });
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

    public getInviteStrikes(guildId: string, userId: string){
        return this.getUser(guildId, userId).then((r: User) => {
            return r.invite_strikes;
        })
    }

    public incrementCleverbotCalls(guildId: string){
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.increment(Guild, {id: guildId}, 'cleverbot_calls', 1);
        });
    }

    public addInfraction(staff: GuildMember, target: GuildMember, reason: string, weight: number): Promise<Partial<Infraction>> {
        const expiration_date = moment(new Date()).add(2, 'w').toDate();
        return this.invalidateCache('infractions').then(() => {
            return this.conn.manager.save(Infraction, {
                target_id: target.id,
                guild_id: staff.guild.id,
                guild_name: staff.guild.name,
                staff_id: staff.id,
                staff_name: staff.user.username,
                infraction_reason: reason,
                infraction_weight: weight,
                infraction_date: new Date(),
                expiration_date: expiration_date
            });
        }).catch(err => Promise.reject(err));
    }

    public getInfractions(guildId: string, targetId?: string): Promise<Infraction[]>{
        if (targetId){
            return this.conn.manager.find(Infraction, {where: {
                    guild_id: guildId,
                    target_id: targetId
                }, cache: true});
        }
        return this.conn.manager.find(Infraction, {where: {guild_id: guildId}, cache: true});
    }

    public getInfractionById(id: number){
        return this.conn.manager.findOne(Infraction, {where: {infraction_id: id},  cache: true});
    }

    public deleteInfractionById(id: number, guildId: string){
        return this.conn.createQueryBuilder()
            .delete()
            .from(Infraction)
            .where('infraction_id = :infraction_id AND guild_id = :guild_id', {infraction_id: id, guild_id: guildId})
            .execute();
    }

    public deleteAllInfractions(guildId: string, target_id: string){
        return this.invalidateCache('infractions').then(() => {
            return this.conn.manager
                .createQueryBuilder()
                .delete()
                .from(Infraction)
                .where("guild_id = :guild AND target_id = :target",
                    {guild: guildId, target: target_id})
                .returning('*')
                .execute();
        });
    }

    public incrementBanCount(guildId: string){
        return this.conn.manager.increment(Guild, {id: guildId}, `users_banned`, 1);
    }

    public incrementHistoryCalls(guildId: string, userId: string){
        return this.invalidateCache('users').then(() => {
            return this.conn.manager.increment(User, {id: userId, guild_id: guildId}, `history_calls`, 1);
        });
    }

    public getHistoryCalls(guildId: string, userId: string){
        return this.getUser(guildId, userId).then((r: User) => {
            return r.history_calls;
        })
    }

    public addMutedUser(guildId: string, userId: string, muteAmount: Date){
        return this.invalidateCache('muted_users').then(() => {
            return this.conn.manager.save(MutedUser, {
                user_id: userId,
                guild_id: guildId,
                start_date: new Date(),
                end_date: muteAmount
            }).catch(err => Promise.reject(err))
        });
    }

    public setMuteRole(guildId: string, role: string){
        return this.invalidateCache('guilds').then(() => {
            this.conn.manager.save(Guild, {
                id: guildId,
                mute_role: role
            })
        }).catch(err => Promise.reject(err));
    }

    public getMuteRole(guildId: string){
        return this.getGuild(guildId).then((r:Guild) => {
            return r.mute_role;
        }).catch(err => Promise.reject(err));
    }

    public addSuggestion(message: Message, suggestion: string){
        return this.invalidateCache('suggestions').then(() => {
            return this.conn.manager.save(Suggestion, {
                guild_id: message.guild.id,
                guild_name: message.guild.name,
                user_id: message.author.id,
                user_name: message.author.username,
                suggestion_date: new Date(),
                suggestion_message: suggestion
            });
        });
    }

    public changeSuggestionStatus(id: string, status: string, reason?: string){
        return this.invalidateCache('suggestions').then(() => {
            const set: {[id: string]: string} = {
                suggestion_status: status
            };

            if (reason){
                set['status_reason'] = reason;
            }

            return this.conn.manager.createQueryBuilder()
                .update(Suggestion)
                .set(set)
                .where(`suggestion_id = :id`, {id: id})
                .returning('*')
                .execute();
        });
    }

    public setSuggestionMetadata(suggestionId: string, channelId: string, embedId: string){
        return this.conn.manager.createQueryBuilder()
            .update(Suggestion)
            .set({channel_id: channelId, message_id: embedId})
            .where(`suggestion_id = :suggestion_id`, {suggestion_id: suggestionId})
            .returning('*')
            .execute();
    }

    public approveSuggestion(id: string): Promise<UpdateResult> {
        return this.changeSuggestionStatus(id, 'APPROVED');
    }

    public denySuggestion(id: string): Promise<UpdateResult> {
        return this.changeSuggestionStatus(id, 'DENIED');
    }

    public acceptSuggestion(id: string, reason: string){
        return this.changeSuggestionStatus(id, 'ACCEPTED', reason);
    }

    public rejectSuggestion(id: string, reason: string){
        return this.changeSuggestionStatus(id, 'REJECTED', reason);
    }

    public getSuggestion(guildId: string, suggestionId: string){
        return this.conn.manager.findOne(Suggestion, {where: {guild_id: guildId, suggestion_id: suggestionId}, cache: true});
    }

    public getPendingSuggestions(guildId: string){
        return this.conn.getRepository(Suggestion)
            .createQueryBuilder('suggestions')
            .where(`guild_id = :id AND suggestion_status = 'AWAITING_APPROVAL'`, {id: guildId})
            .orderBy('suggestions.suggestion_date', 'DESC')
            .getMany();
    }

    public incrementCommandCalls(guildId: string, userId: string){
        return this.invalidateCache('users').then(() => {
            return this.conn.manager.increment(User, {id: userId, guild_id: guildId}, 'commands_used', 1);
        });
    }

    public incrementMacroCalls(guildId: string, userId: string){
        return this.invalidateCache('users').then(() => {
            return this.conn.manager.increment(User, {id: userId, guild_id: guildId}, 'macros_used', 1);
        });
    }

    public async changeSpecificLoggingChannel(guild: DiscordGuild, type: LoggingChannelType | LoggingChannelType[], channelId: string | undefined){
        await this.invalidateCache('guilds');

        if (Array.isArray(type)){
            const o = type.reduce((obj: {[t: string]: string | null}, item: LoggingChannelType) => {
                obj[item] = channelId ? channelId : null;
                return obj;
            }, <{[t: string]: string}>{});

            return this.conn.manager.save(Guild, {
                id: guild.id,
                name: guild.name,
                ...o
            })
        }
        return this.conn.manager.save(Guild, {
            id: guild.id,
            name: guild.name,
            [type]: channelId ? channelId : null
        })
    }

    public async getChannelIgnored(guildId: string, channelId: string){
        return this.conn.manager.findOne(IgnoredChannel, {where: {guild_id: guildId, channel_id: channelId}, cache: true});
    }

    public async getIgnoredChannels(guildId: string){
        return this.conn.manager.find(IgnoredChannel, {where: {guild_id: guildId}, cache: true});
    }

    public async setChannelIgnored(guildId: string, channelId: string, ignorer: string, status: boolean){
        return this.invalidateCache('ignored_channels').then(() => {
            if (status){
                return this.conn.createQueryBuilder()
                    .insert()
                    .into(IgnoredChannel)
                    .values({
                        channel_id: channelId,
                        guild_id: guildId,
                        ignore_date: new Date(),
                        ignored_by: ignorer
                    })
                    .onConflict(`("channel_id", "guild_id") DO NOTHING`)
                    .execute();

            }
            return this.conn.createQueryBuilder()
                .delete()
                .from(IgnoredChannel)
                .where("channel_id = :channel_id AND guild_id = :guild_id",
                    {channel_id: channelId, guild_id: guildId})
                .execute();
        });
    }
}

