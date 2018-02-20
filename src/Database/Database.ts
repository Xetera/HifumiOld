import * as Mysql from 'promise-mysql'
import * as fs from 'fs'
const config = require('../config0.json');
import {debug} from '../Logging'

interface ICredentials {
    host: string;
    user : string;
    password : string;
    database : string;
}

export class Database {
    defaultCredentials : ICredentials = {
        host: 'localhost',
        user: 'root',
        password: config.mySql.password,
        database: 'discord'
    };
    credentials : ICredentials;
    conn : Mysql.Connection;

    constructor(credentials ?: ICredentials){
        this.credentials = credentials ? credentials : this.defaultCredentials;
        this.connect().then(conn => {
            this.conn = conn;
        });
    }
    public connect() : Promise<Mysql.Connection>{
        const self = this;
        return new Promise(async function (resolve, reject) {
            Mysql.createConnection(self.credentials).then(conn => {
                resolve(conn);
            }).catch( err => {
                debug.error("Unexpected error while logging in to database", err);
            })
        })
    }


}