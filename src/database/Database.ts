import {
    getWhitelistedInvites,
} from "./queries/PreparedStatements";
import {IDatabase, IMain, IOptions, ITask, TQuery} from 'pg-promise'
import {defaultTableTemplates, getPrefixes, testQuery} from "./queries/QueryTemplates";
import {Channel, Client, Collection, Guild, GuildMember, Message, TextChannel} from "discord.js";
import {IGuild, IUser} from "./TableTypes";
import * as pgPromise from 'pg-promise'
import {debug} from '../utility/Logging'
import {ICachedGuild, ICachedUser, userId} from "./interface";
import {
    changeInviteSetting,
    changeLockdownStatus,
    getCommandHint,
    getGuild,
    getMemberInviteStrikes,
    saveGuild, setCommandHint, setInvitesAllowed,
    updateLogsChannel,
    updateWelcomeChannel,
    upsertPrefix
} from "./queries/guildQueries";
import {
    cleanAllGuildMembers, getAllMembers, getMember, incrementCleverbotMemberCall, incrementMemberInviteStrikes,
    insertMember,
    saveMember, setIgnored
} from "./queries/userQueries";
import gb from "../misc/Globals";
import {Environments} from "../events/systemStartup";
import {debug} from "../utility/Logging";
import {User} from "./models/user";
import {Guild, LoggingChannelType} from "./models/guild";
import {GuildMember, Message, Guild as DiscordGuild, GuildAuditLogsFetchOptions} from "discord.js";
import {Macro} from "./models/macro";
import {Note} from "./models/note";
import 'reflect-metadata';
import * as fs from 'fs'
import {Infraction} from "./models/infraction";
import moment = require("moment");
import {MutedUser} from "./models/mutedUser";
import {Suggestion} from "./models/suggestion";
const rootConfig: IORMConfig = require('../../ormconfig.json');



export interface PostgresDevLoginConfig {
    type: string;
    host: string;
    port: number;
    database: string;
    user: string;
}

export interface PostgresLiveLoginConfig {
    type: string;
    connectionString: string;
    ssl: boolean;
}

export type DatabaseConfig = PostgresLiveLoginConfig|PostgresDevLoginConfig;
export type Query = string;
function isDeployementLogin(object: any) : object is PostgresLiveLoginConfig {
    return 'ssl' in object;
}

function getDatabaseType(url : DatabaseConfig){
    return isDeployementLogin(url) ? 'heroku' : 'localhost';
}

                    synchronize: this.env === Environments.Development,
                    dropSchema:  this.env === Environments.Development,

                    // DUDE I'M 100% SERIOUSLY RN I'LL GET SUPER MAD OK
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
            rootConfig.database = this.env === Environments.Development ? 'discord_test' : 'discord_production'
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
    public async sync(): Promise<void> {
        debug.silly(`Crosschecking database`, `Database`);
        const guilds = gb.instance.bot.guilds.array();
        for (let i in guilds) {
            const guild = guilds[i];
            // setting each server
            this.welcomeMessages[guilds[i].id] = [];

            await this.addGuild(guild);

            const g = await guild.fetchMembers();
            await this.addMembers(g.members.array());
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
        })
    };
    config : DatabaseConfig;

    private readonly pgp = pgPromise(this.initOptions);
    private db : IDatabase<any>;
    guilds: Map<string, ICachedGuild>;
    client: Client;
    constructor(url : DatabaseConfig, bot : Client){
        this.client = bot;
        this.config = url;
        debug.info("Logging into Postgres on " + getDatabaseType(url), "Database");
        this.guilds = new Map<string, ICachedGuild>();

        this.db = this.pgp(this.config);
        // we don't want to query the db every message so
        // we're caching the prefixes instead
        debug.info('Database is connected.', "Database");

    }

    public doPrep(){
        this.checkTables()
        .then(() => {
            return this.cacheGuilds();
        }).then(() =>{
            return this.crossCheckDatabase();
        });
    }

    private initializeGuildIfNone(guildId : string) : void {
        let guild: ICachedGuild = this.guilds.get(guildId)!;
        if (guild === undefined) {
            this.guilds.set(guildId, <ICachedGuild> {});
            guild = this.guilds.get(guildId)!;
        }
        if (!guild.users)
            guild.users = [];
        if (!guild.welcomeMessages)
            guild.welcomeMessages = new Map<userId, Message>();
    }

    private async crossCheckDatabase(){
        const guilds : Guild[] = this.client.guilds.array();
        return this.db.task(t => {
            const queries: Query[] = [];
            for (let guild of guilds) {
                guild.members.forEach( (member) => {
                    const id = member.id;
                    const name = member.user.username;
                    const guild_id = member.guild.id;
                    queries.push(t.none(saveMember, [id, name, guild_id]));
                });
                guilds.forEach(function (guild) {
                    const id = guild.id;
                    const name = guild.name;
                    queries.push(t.any(saveGuild, [id, name]));
                });
            }
            return t.batch(queries);
        });
    }

    private async cacheGuilds() : Promise<void> {
        return this.db.any(getPrefixes).then(fields => {
            // returning id, prefix
            fields.forEach(async(guild : IGuild) => {
                let cachedGuild : ICachedGuild | undefined = this.guilds.get(guild.id);
                if (cachedGuild === undefined) {
                    this.guilds.set(guild.id, <ICachedGuild> {});
                    cachedGuild = this.guilds.get(guild.id)!;
                }
                this.cacheUsers(guild.id);
                // TODO: Theres a lot of repetition in this part, make sure we cut this down
                // TODO: To a less indented, more efficient version
                const whitelistedInvites = await this.db.any(getWhitelistedInvites, [guild.id]);

                if (whitelistedInvites.length > 0)
                    cachedGuild.whitelisted_invites = whitelistedInvites.map(item => item.link);

                // we could really be calling this in the begining instead and not here
                this.db.oneOrNone(getGuild, [guild.id]).then((item : ICachedGuild)=> {
                    cachedGuild!.welcome_channel = item.welcome_channel;
                    cachedGuild!.logs_channel = item.logs_channel;
                    cachedGuild!.warnings_channel = item.warnings_channel;
                    cachedGuild!.command_hints = item.command_hints;
                    cachedGuild!.allows_invites = item.allows_invites;
                });

                cachedGuild.prefix  = guild.prefix;
            });
        });
    }

    private cacheUsers(guildId : string){
        this.initializeGuildIfNone(guildId);
        const guild = this.guilds.get(guildId)!;
        this.db.many(getAllMembers, [guildId]).then((users : IUser[]) => {
            guild.users =  users.map(user => {
                return {
                    id: user.id,
                    guild_id: user.guild_id,
                    ignoring: user.ignoring
                }
            });
        })
    }

    private checkTables() : Promise<any> {
        return this.db.task(t => {
            let queries : string[] = [];
            defaultTableTemplates.forEach((query : Query)=> {
                queries.push(t.none(query));
            });
            return t.batch(queries);
        });
    }

    private addGuild(guild : Guild){
        const id = guild.id;
        const name = guild.name;
        return this.db.oneOrNone(saveGuild,[id, name]).then((guild : IGuild)=> {
            this.initializeGuildIfNone(guild.id);
        });
    }

    public getGuild(guild : Guild) : ICachedGuild | undefined {
        return this.guilds.get(guild.id);
    }

    public setPrefix(guild : Guild, prefix : string) : Promise<IGuild|Error|-1> {
        if (prefix.length > 1) // this could change later on where we support up to 3 but na
            // have to Promise.reject outside the promise chain
            return Promise.reject(-1);

        return this.db.one(upsertPrefix, [guild.id, prefix]).then((res: IGuild)=> {
            // changing our cached value as well
            const cached = this.guilds.get(guild.id)!;
            if (cached === undefined)
                this.guilds.set(guild.id, <ICachedGuild> {});

            cached.prefix = res.prefix;
            return res;
        }).catch((err : Error) => {
            debug.error("Error while updating prefix.\n"+ err, "Database");
            return err;
        });
    }

    public getPrefix(guildId : string) {
        if (this.guilds.get(guildId) === undefined ) {
            this.initializeGuildIfNone(guildId);
            return '.';
        }
        return this.guilds.get(guildId)!.prefix;
    }

    public insertMember(member : GuildMember) {
        const id = member.user.id;
        const username = member.user.username;
        const guild_id = member.guild.id;
        this.initializeGuildIfNone(member.guild.id);
        const guild = this.guilds.get(member.guild.id)!;

        this.db.oneOrNone(getMember, [member.guild.id, member.id]).then((res: IUser | undefined) => {
            if (!res)
                return this.db.one(insertMember, [id, username, guild_id]);
        });

    public isUserIgnored(member: GuildMember): Promise<boolean> {
        return this.getUser(member.guild.id, member.id).then((r: User) => {
            if (!r){
                // sometimes users aren't saved
                this.addMember(member);
                return false;
            }
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
    public setCommandHints(guildId: string, state: boolean): Promise<Partial<Guild>> {
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.save(Guild, {id: guildId, hints: state});
        });
    }

    public getCommandHints(guildId: string){
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

    public getInviteStrikes(guildId: string, userId: string){
        return this.getUser(guildId, userId).then((r: User) => {
            return r.invite_strikes;
        })
    }

    public setReactions(guildId: string, state: boolean){
        return this.invalidateCache('guilds').then(() => {
            return this.conn.manager.save(Guild, {
                id: guildId,
                reactions: state
            });

        }
    }

    public cacheWelcomeMessage(member: GuildMember, welcomeMessage: Message){
        const targetGuild: ICachedGuild| undefined = this.guilds.get(member.guild.id);
        if(!targetGuild)
            return debug.error(`Guild ${member.guild.name} was not found in cache`, 'Database');

        targetGuild.welcomeMessages.set(member.id, welcomeMessage);
    }

    public uncacheWelcomeMessage(member: GuildMember): Message| undefined{
        const targetGuild: ICachedGuild| undefined = this.guilds.get(member.guild.id);
        if(!targetGuild){
            debug.error(`Guild ${member.guild.name} was not found in cache`, 'Database');
            return;
        }
        const message: Message | undefined = targetGuild.welcomeMessages.get(member.id);
            if (!message)
                debug.error(`Welcome message for user ${member.user.username} was not found`, 'Database');
        targetGuild.welcomeMessages.delete(member.id);
        return message;
    }

    public getUsers(guildId : string){
        return this.db.many(getAllMembers, [guildId]).then((r : IUser[]) => {
            return r;
        })
    }

    public addBlacklistedLink(link : string){

    }

    public removeBlacklistedLink(link : string){

    }

    public addWhitelistedInvite(invite : string){
        // we need to make sure we're only matching the
        // invite part of this and not the whole link itself
    }

    public removeWhitelistedInvite(invite : string){

    }

    public allowInvites(guildId: string){
        return this.db.oneOrNone(changeInviteSetting, [guildId, ])
    }

    public updateWelcomeChannel(guildId : string, channelId : string) : Promise<string>{
        return this.db.oneOrNone(updateWelcomeChannel, [channelId, guildId]).then((r: IGuild)=> {
            this.initializeGuildIfNone(guildId);
            this.guilds.get(guildId)!.welcome_channel = r.welcome_channel;
            return r.welcome_channel;
        });
    }

    public getWelcomeChannel(guildId: string) : Channel | undefined {
        const guild = this.guilds.get(guildId);
        if (guild === undefined) return undefined;
        return this.client.channels.get(guild.welcome_channel);
    }

    public updateLogsChannel(guildId : string, channelId : string){
        return this.db.oneOrNone(updateLogsChannel, [channelId, guildId]).then((r : IGuild) => {
            this.initializeGuildIfNone(guildId);
            this.guilds.get(guildId)!.logs_channel = r.logs_channel;
            return r.logs_channel;
        });
    }

    public getLogsChannel(guildId : string):Channel|undefined {
        const guild = this.guilds.get(guildId);
        if (!guild) return undefined;
        return this.client.channels.get(guild.logs_channel);
    }

    public restockGuildMembers(guild :Guild){
        this.initializeGuildIfNone(guild.id);

        return this.addGuild(guild).then( ()=> {
            return this.db.none(cleanAllGuildMembers, [guild.id])
        }).then(() => {
            guild.members.forEach((member: GuildMember) => {
                this.insertMember(member);
            });
        });
    }

    public insertNewGuild(guild : Guild){
        this.initializeGuildIfNone(guild.id);
        this.addGuild(guild);
        guild.members.forEach((member: GuildMember )=> {
            this.insertMember(member);
        });
    }

    public getMemberInviteStrikes(member : GuildMember){
        const id = member.id;
        const guild_id = member.guild.id;
        return this.db.oneOrNone(getMemberInviteStrikes, [id, guild_id]).then((res : IUser)=> {
            return res.invite_strikes;
        })
    }

    public incrementMemberInviteStrikes(member : GuildMember){
        const id = member.id;
        const guild_id = member.guild.id;
        return this.db.one(incrementMemberInviteStrikes, [id, guild_id]).then((res:IUser )=> {
            return res.invite_strikes;
        });
    }

    public getLockdownStatus(guild: Guild) : boolean {
        this.initializeGuildIfNone(guild.id);
        return this.guilds.get(guild.id)!.lockdown;
    }

    public changeLockdownStatus(guild : Guild, status : boolean){
        const target = this.guilds.get(guild.id);
        if (target === undefined)
            return debug.warning(`Guild ${guild.name} does not exist.`);
        if (target!.lockdown === status)
            return debug.warning(`Tried to set lockdown`+
                ` status of ${guild.name} to ${status} but it is already ${status}`);

        target!.lockdown = status;
        this.db.one(changeLockdownStatus, [guild.id, status]);
    }

    public setIgnored(member : GuildMember, state : boolean){
        const cachedGuild = this.guilds.get(member.guild.id);
        if (!cachedGuild){
            debug.error(`Could not find cached guild ${member.guild.name}.`, 'Database')
            return Promise.reject(`Could not find cached guild ${member.guild.name}`);
        }
        return this.db.one(setIgnored, [state, member.guild.id, member.id]).then((user : IUser) => {
            debug.info(`Now ignoring user ${member.user.username}.`);
            cachedGuild.users.find(user => user.id === member.id)!.ignoring = user.ignoring;
            return user.ignoring;
        });
    }

    public getIgnored(member : GuildMember){
        const guild = this.guilds.get(member.guild.id);
        if (!guild) {
            debug.warning(`server: ${member.guild.name} is not cached!`);
            return undefined;
        }
        const target : ICachedUser | undefined = guild.users.find(user => user.id === member.id);
        if (!target){
            debug.warning(`user: ${member.user.username} is not cached!`);
            return undefined;
        }

        return target.ignoring;
    }

    public getRaidStatus(guild : Guild)  {

    }

    public incrementCleverbotCall(member: GuildMember){
        const guildId = member.guild.id;
        this.db.one(incrementCleverbotGuildCall,  [guildId]);
        this.db.one(incrementCleverbotMemberCall, [guildId, member.id]);
    }

    public restockCleverbot(){
        const guilds = gb.instance.bot.guilds.array();
        for (let i in guilds){
            this.db.one(inserCleverbotGuild, [guilds[i].id, false, 0])
        }
    }

    public getCommandHints(guild: Guild): boolean{
        const target = this.guilds.get(guild.id);
        if (target && target.command_hints !== undefined)
            return target.command_hints;
        return true;
    }
    public setCommandHints(guild: Guild, state: boolean) {
        const cached = this.guilds.get(guild.id);
        return this.db.one(setCommandHint, [state, guild.id]).then((res: IGuild)=> {
            if (cached){
                cached.command_hints = res.command_hints;
            }
            return res.command_hints;
        })
    }

    public getInvitesAllowed(guild: Guild): boolean {
        const target = this.guilds.get(guild.id);
        if (!target){
            debug.error(`Could not get allowed_invites for guild ${guild.id}`);
            return false;
        }
        return target.allows_invites;
    }

    public setInvitesAllowed(guild: Guild, state: boolean) {
        const cached = this.guilds.get(guild.id);
        return this.db.one(setInvitesAllowed, [state, guild.id]).then((res: IGuild) => {
            if (cached){
                cached.allows_invites = res.allows_invites;
            }
            return res.allows_invites;
        })
    }
}
