import {insertGuild, PreparedStatement, upsertPrefix} from "./PreparedStatements";

const config = require('../../config0.json');
import {PSQLErrors} from "../Interfaces/Errors";
import {debug} from '../Utility/Logging'
import {IDatabase, IMain, IOptions, ITask} from 'pg-promise'
import * as pgPromise from 'pg-promise'
import {defaultTableTemplates, getPrefixes} from "./QueryTemplates";
import QueryResultError = pgPromise.errors.QueryResultError;
import {Guild} from "discord.js";
import {IGuild} from "./TableTypes";

interface guildPrefix {
    id: string;
    prefix: string;
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
                console.log('CN:', e.cn);
                console.log('EVENT:', error.message || error);
            }
        })
    };
    readonly config = {
        host: 'localhost',
        port: 5432,
        database: 'discord',
        user: 'postgres'
    };
    pgp = pgPromise(this.initOptions);
    db : IDatabase<any>;
    prefixes : {[id: string]: string} = {};

    constructor(){
        this.db = this.pgp(this.config);
        this.checkTables();
        // we don't want to query the db every message so
        // we're caching the prefixes instead
        this.cachePrefixes();
    }

    public getPrefix(guildId : string){
        return this.prefixes[guildId];
    }

    private cachePrefixes() : void {
        this.db.any(getPrefixes).then(fields => {
            fields.forEach((guild : guildPrefix)=> {
                this.prefixes[guild.id] = guild.prefix;
            });
        });
    }

    private checkTables() : Promise<any> {
        return this.db.task(t => {
            let queries : string[] = [];
            defaultTableTemplates.forEach(query => {
                queries.push(t.none(query));
            });
            return t.batch(queries)
        });
    }

    public setPrefix(guild_id : string, prefix : string) : Promise<IGuild>{
        if (prefix.length > 1) // this could change later on where we support up to 3 but na
            throw new RangeError(`${prefix} is not a 1 char variable.`);

        const prepStatement : PreparedStatement = upsertPrefix(guild_id, prefix);
        console.log(prepStatement);
        return this.db.one(prepStatement).then(res => {
            // changing our cached value as well
            this.prefixes[guild_id] = prefix;
            return res;
        }).catch((err : QueryResultError) => {
            console.log(err);
        });
    }

    public addGuild(guild : Guild){
        this.db.one(insertGuild(guild.id, guild.name));
    }

}