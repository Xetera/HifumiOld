import {PostgresLiveLoginConfig, PostgresDevLoginConfig, Database, DatabaseConfig} from "../database/Database";
import gb, {Instance} from "../misc/Globals";
import {Client, Guild, Message} from "discord.js";
import {debug} from '../utility/Logging'
import {MessageQueue} from "../moderation/MessageQueue";
import CommandHandler from "../handlers/commands/CommandHandler";
import Watchlist from "../moderation/Watchlist";
import {Alexa} from "../API/Alexa";
import {MuteQueue} from "../moderation/MuteQueue";
import {LogManager} from "../handlers/logging/logManager";

export enum Environments {
    Development,
    Live
}

declare let process : {
    env: {
        BOT_TOKEN: string,
        CLEVERBOT_TOKEN: string
        ENV: string;
        DATABASE_URL: string;
    }
};

export function getEnvironmentSettings() : Environments{
    let env;

    if (process.env.ENV === "LIVE"){
        debug.info('Current environment is Live.', "Startup");
        env = Environments.Live;
    }
    else if (process.env.ENV === "DEVELOPMENT"){
        debug.info('Current environment is Development', "Startup");
        env = Environments.Development;
    }
    else {
        debug.error(`Unexpected environment: ${process.env.ENV}, setting environment to DEVELOPMENT.`, "Startup");
        env = Environments.Development;
    }

    return env;
}

export function getTokens(env: Environments) {
    let BOT_TOKEN : string;
    let CLEVERBOT_TOKEN : string;

    if (env === Environments.Live){
        // settings for heroku
        BOT_TOKEN = process.env.BOT_TOKEN;
        CLEVERBOT_TOKEN = process.env.CLEVERBOT_TOKEN;
    } else if (env === Environments.Development){
        // settings for development
        BOT_TOKEN = require('../../config0.json').TOKEN;
        CLEVERBOT_TOKEN = require('../../config0.json').CleverBotAPI;
    }
    else {
        debug.error(`Unexpected environment: ${env}, setting token variables assuming deployment.`, "Startup");
        BOT_TOKEN = require('../../config0.json').TOKEN;
        CLEVERBOT_TOKEN = require('../../config0.json').CleverBotAPI;
    }
    return [BOT_TOKEN, CLEVERBOT_TOKEN];
}


export function getDatabaseConnection(env: Environments) : PostgresDevLoginConfig|PostgresLiveLoginConfig {
    if (env === Environments.Live){
        let credentials = <PostgresLiveLoginConfig>{};
        credentials.connectionString = process.env.DATABASE_URL;
        credentials.ssl = true;
        return credentials;
    }
    else {
        let credentials = <PostgresDevLoginConfig>{};
        credentials.user = 'postgres';
        credentials.host = 'localhost';
        credentials.port = 5432;
        credentials.database = 'discord';
        return credentials;
    }
}

// instances
export function createInstance(BOT_TOKEN: string, CLEVERBOT_TOKEN: string, DATABASE_CONFIG: DatabaseConfig): Instance {
    // this is how we avoid scoping problems, a little ugly but
    // it gets the job done
    let bot = new Client();
    bot.login(BOT_TOKEN);
    let alexa = new Alexa(CLEVERBOT_TOKEN);
    let database = new Database(DATABASE_CONFIG, bot);
    let muteQueue = new MuteQueue();
    let watchlist = new Watchlist();
    let messageQueue = new MessageQueue(muteQueue, database, watchlist);
    let commandHandler = new CommandHandler();
    return {
        bot: bot,
        alexa: alexa,
        muteQueue: muteQueue,
        database: database,
        messageQueue: messageQueue,
        commandHandler:commandHandler,
        watchlist: watchlist,
        // this is to be able to eval through the context of all the instances
        eval: (message: Message, x : any) => eval(x)
    }
}