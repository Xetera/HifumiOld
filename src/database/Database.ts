import {
    getWelcomeChannel, getMemberInviteStrikes,
    getWhitelistedInvites, incrementMemberInviteStrikes, saveGuild, updateWelcomeChannel,
    upsertPrefix, insertMember, cleanAllGuildMembers, changeLockdownStatus, saveMember, getAllUsers, updateLogsChannel,
    getGuild
} from "./PreparedStatements";
import {IDatabase, IMain, IOptions, ITask, TQuery} from 'pg-promise'
import {defaultTableTemplates, getPrefixes, testQuery} from "./QueryTemplates";
import {Client, Collection, Guild, GuildMember} from "discord.js";
import {IGuild, IUser} from "./TableTypes";

import * as pgPromise from 'pg-promise'
import {debug} from '../utility/Logging'

export interface ICachedGuild {
    prefix: string;
    blacklisted_links: string[];
    whitelisted_invites: string[];
    welcome_channel: string;
    logs_channel : string;
    warnings_channel : string;
    lockdown: boolean;
}

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


export class Database {
    // variable login based on environment
    readonly initOptions = {
        // global event notification;
        error: ((error: any, e :any) => {
            if (e.cn) {
                // A connection-related error;
                //
                // Connections are reported back with the password hashed,
                // for safe errors logging, without exposing passwords.
                debug.error('CN:\n'+ e.cn, "Database");
                debug.error('EVENT:\n'+ error.message || error, "Database");
            }
        })
    };
    config : DatabaseConfig;

    private pgp = pgPromise(this.initOptions);
    private db : IDatabase<any>;
    guilds : Map<string, ICachedGuild>;
    client : Client;

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
            this.cacheGuilds();
        }).then(() =>{
            this.crossCheckDatabase();
        })
    }

    private initializeGuildIfNone(guildId : string) : boolean{
        const guild = this.guilds.get(guildId);
        if (guild === undefined){
            this.guilds.set(guildId, <ICachedGuild> {});
            // kind of pointless but whatever
            return false;
        }
        else {
            return true;
        }
    }

    private async crossCheckDatabase(){
        const guilds : Guild[] = this.client.guilds.array();
        return this.db.task(t => {
            const queries: Query[] = [];
            for (let guild of guilds) {
                const members : GuildMember[] = guild.members.array();
                guild.members.forEach(function (member) {
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
                    cachedGuild = this.guilds.get(guild.id);
                }

                // TODO: Theres a lot of repetition in this part, make sure we cut this down
                // TODO: To a less indented, more efficient version
                const whitelistedInvites = await this.db.any(getWhitelistedInvites, [guild.id]);
                if (whitelistedInvites.length > 0)
                    cachedGuild.whitelisted_invites = whitelistedInvites.map(item => item.link);

                // we could really be calling this in the begining instead and not here
                this.db.oneOrNone(getGuild, [guild.id]).then((item : ICachedGuild)=> {
                    cachedGuild.welcome_channel = item.welcome_channel;
                    cachedGuild.logs_channel = item.logs_channel;
                    cachedGuild.warnings_channel = item.warnings_channel
                });

                cachedGuild.prefix  = guild.prefix;
            });
        });
    }

    private async cacheNewGuild(guild : IGuild){
        const cached = this.guilds.get(guild.id);
        if (cached !== undefined){
            this.guilds.set(guild.id, <ICachedGuild> {});
        cached.prefix = guild.prefix;
        cached.whitelisted_invites = [];
        cached.blacklisted_links = [];
        }
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
            this.cacheNewGuild(guild);
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
            const cached = this.guilds.get(guild.id);
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
        return this.guilds.get(guildId).prefix;
    }

    public insertMember(member : GuildMember) {
        const id = member.user.id;
        const username = member.user.username;
        const guild_id = member.guild.id;
        return this.db.one(insertMember, [id, username, guild_id]).then((res : IUser)=> {
            return; // nothing for now
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

    public updateWelcomeChannel(guildId : string, channelId : string) : Promise<string>{
        return this.db.oneOrNone(updateWelcomeChannel, [channelId, guildId]).then((r: IGuild)=> {
            this.initializeGuildIfNone(guildId);
            this.guilds.get(guildId).welcome_channel = r.welcome_channel;
            return r.welcome_channel;
        });
    }

    public getWelcomeChannel(guildId: string) : string | undefined {
        const guild = this.guilds.get(guildId);
        if (guild === undefined) return undefined;
        return guild.welcome_channel;
    }

    public updateLogsChannel(guildId : string, channelId : string){
        return this.db.oneOrNone(updateLogsChannel, [channelId, guildId]).then((r : IGuild) => {
            this.initializeGuildIfNone(guildId);
            this.guilds.get(guildId).logs_channel = r.logs_channel;
            return r.logs_channel;
        });
    }

    public getLogsChannel(guildId : string){
        const guild = this.guilds.get(guildId);
        if (!guild) return undefined;
        return guild.logs_channel;
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
        return this.guilds.get(guild.id).lockdown;
    }

    public changeLockdownStatus(guild : Guild, status : boolean){
        if (this.guilds.get(guild.id) === undefined)
            return debug.warning(`Guild ${guild.name} does not exist.`);
        if (this.guilds.get(guild.id).lockdown === status)
            return debug.warning(`Tried to set lockdown`+
                ` status of ${guild.name} to ${status} but it is already ${status}`);

        this.guilds.get(guild.id).lockdown = status;
        this.db.one(changeLockdownStatus, [guild.id, status]);
    }

    public getRaidStatus(guild : Guild)  {

    }
}