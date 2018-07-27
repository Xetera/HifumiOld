import {Database} from "../database/Database";
import {Instance} from "../misc/Globals";
import {Client, Message} from "discord.js";
import {debug} from '../utility/Logging'
import {MessageQueue} from "../moderation/MessageQueue";
import Tracklist from "../moderation/Tracklist";
import {MuteQueue} from "../moderation/MuteQueue";
import {default as catchUncaughtExceptions} from '../handlers/process/uncaughtException'
import {catchSigterm} from '../handlers/process/sigterm'
import {default as catchUnhandledRejections} from '../handlers/process/unhandledRejection'
const Heroku = require('heroku-client');
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
        HEROKU_API_TOKEN: string;
        REDISCLOUD_URL: string;
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
    debug.info('Getting Tokens', 'Startup');
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


export function getDatabaseConnection(env: Environments) : string {
    if (env === Environments.Development && !process.env.DATABASE_URL){
        debug.info("No database url ENV found, setting it to 'discord_test'", 'Startup');
        return 'postgresql:///discord_test';
    }
    else if (env === Environments.Development && process.env.DATABASE_URL)
        return process.env.DATABASE_URL;
    return process.env.DATABASE_URL;
}

// instances
export async function createInstance(bot: Client, BOT_TOKEN: string, CLEVERBOT_TOKEN: string, DATABASE_CONFIG: string): Promise<Instance> {
    // this is how we avoid scoping problems, a little ugly but
    // it gets the job done
    // TODO: Smarter Xetera to past Xetera, use singletons or
    // TODO: dependency injections <- this is probably less stupid
    let database  = new Database(DATABASE_CONFIG);
    let muteQueue = new MuteQueue();
    let tracklist = new Tracklist();
    // probably not a good place to have this side effect but whatever
    let messageQueue = new MessageQueue(muteQueue, database, tracklist);
    return {
        bot: bot,
        muteQueue: muteQueue,
        database: database,
        messageQueue: messageQueue,
        trackList: tracklist,
        heroku: new Heroku({token: process.env.HEROKU_API_TOKEN}),
        // this is to be able to eval through the context of all the instances
        eval: (message: Message, x: any) => {
            try {
                return eval(x);
            }
            catch (e) {
                return e.toString();
            }
        }
    }

}

export function setupProcess(){
    catchUncaughtExceptions();
    catchUnhandledRejections();
    catchSigterm(true);
}


