const config = require('../config0.json');
import {debug} from '../Utility/Logging'
import {IMain, IDatabase} from 'pg-promise'
import * as pg from 'pg-promise'

interface ICredentials {
    host: string;
    user : string;
    password : string;
    database : string;
}

export class Database {
    cn : ICredentials = {
        host: 'localhost',
        user: 'root',
        password: config.database.password,
        database: 'discord'
    };
    credentials : ICredentials;


    constructor(credentials ?: ICredentials){

    }
    public connect() {

    }
    public disconnect(){

    }

}