import {
    getDefaultChannel, getMemberInviteStrikes,
    getWhitelistedInvites, incrementMemberInviteStrikes, insertGuild, PreparedStatement, updateDefaultChannel,
    upsertPrefix, insertMember, cleanAllGuildMembers, changeLockdownStatus
} from "./PreparedStatements";
import {IDatabase, IMain, IOptions, ITask} from 'pg-promise'
import {defaultTableTemplates, getPrefixes, testQuery} from "./QueryTemplates";
import {Collection, Guild, GuildMember} from "discord.js";
import {IGuild, IUser} from "./TableTypes";

import * as pgPromise from 'pg-promise'
import {debug} from '../utility/Logging'

interface ICachedGuild {
    prefix: string;
    blacklistedLinks: string[];
    whitelistedInvites: string[];
    defaultChannel: string;
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


    constructor(url : DatabaseConfig){
        this.config = url;
        debug.info("Logging into Postgres on " + getDatabaseType(url), "Database");
        this.guilds = new Map<string, ICachedGuild>();
        this.db = this.pgp(this.config);
        this.checkTables();
        // we don't want to query the db every message so
        // we're caching the prefixes instead
        this.cacheGuilds();
        debug.info('Database is connected.', "Database");

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

    private async cacheGuilds() : Promise<void> {
        return this.db.any(getPrefixes).then(fields => {
            // returning id, prefix
            fields.forEach(async(guild : IGuild) => {
                let cachedGuild : ICachedGuild | undefined = this.guilds.get(guild.id);
                if (cachedGuild === undefined) {
                    this.guilds.set(guild.id, <ICachedGuild> {});
                    cachedGuild = this.guilds.get(guild.id);
                }

                const whitelistedInvites = await this.db.any(getWhitelistedInvites(guild.id));
                if (whitelistedInvites.length > 0)
                    cachedGuild.whitelistedInvites = whitelistedInvites.map(item => item.link);

                //let defaultChannel;
                this.db.oneOrNone(getDefaultChannel(guild.id)).then(item => {
                    cachedGuild.defaultChannel = item.default_channel;
                });

                cachedGuild.prefix  = guild.prefix;

                //debug.info(this.guilds);
            });
        });
    }

    private async cacheNewGuild(guild : IGuild){
        const cached = this.guilds.get(guild.id);
        if (cached !== undefined){
            this.guilds.set(guild.id, <ICachedGuild> {});
        cached.prefix = guild.prefix;
        cached.whitelistedInvites = [];
        cached.blacklistedLinks = [];
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
        return this.db.oneOrNone(insertGuild(guild)).then((guild : IGuild)=> {
            this.cacheNewGuild(guild);
        });
    }

    public setPrefix(guild : Guild, prefix : string) : Promise<IGuild|Error|-1> {
        if (prefix.length > 1) // this could change later on where we support up to 3 but na
            // have to Promise.reject outside the promise chain
            return Promise.reject(-1);

        const query : string = upsertPrefix(guild, prefix);
        return this.db.one(query).then((res: IGuild)=> {
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
        return this.db.one(insertMember(member)).then((res : IUser)=> {
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

    public updateDefaultChannel(guildId : string, channelId : string) : Promise<string>{
        return this.db.oneOrNone(updateDefaultChannel(guildId, channelId)).then((r: IGuild)=> {
            this.initializeGuildIfNone(guildId);
            this.guilds.get(guildId).defaultChannel = r.default_channel;
            return r.default_channel;
        });
    }

    public getDefaultChannel(guildId: string) : string | undefined {
        const guild = this.guilds.get(guildId);
        if (guild === undefined) return undefined;
        return guild.defaultChannel;
    }

    public restockGuildMembers(guild :Guild){
        this.initializeGuildIfNone(guild.id);

        return this.addGuild(guild).then( ()=> {
            return this.db.none(cleanAllGuildMembers(guild))
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
        return this.db.oneOrNone(getMemberInviteStrikes(member)).then((res : IUser)=> {
            return res.invite_strikes;
        })
    }

    public incrementMemberInviteStrikes(member : GuildMember){
        return this.db.one(incrementMemberInviteStrikes(member)).then((res:IUser )=> {
            return res.invite_strikes;
        });
    }

    public getLockdownStatus(guild: Guild) : boolean {
        this.initializeGuildIfNone(guild.id);
        return this.guilds.get(guild.id).lockdown;
    }

    public changeLockdownStatus(guild : Guild, status : boolean){
        if (this.guilds.get(guild.id).lockdown === status)
            return debug.warning(`Tried to set lockdown`+
                ` status of ${guild.name} to ${status} but it is already ${status}`);

        this.guilds.get(guild.id).lockdown = status;
        this.db.one(changeLockdownStatus(guild, status));
    }

    public getRaidStatus(guild : Guild)  {

    }
}