const config = require('../config0.json');
import {debug} from '../Utility/Logging'

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