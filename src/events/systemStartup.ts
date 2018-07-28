import {Database} from "../database/Database";
import {gb, Instance} from "../misc/Globals";
import {Client, Message} from "discord.js";
import {debug} from '../utility/Logging'
import {MessageQueue} from "../moderation/MessageQueue";
import CommandHandler from "../handlers/commands/CommandHandler";
import Tracklist from "../moderation/Tracklist";
import {Cleverbot} from "../API/Cleverbot";
import {MuteQueue} from "../moderation/MuteQueue";
import {default as catchUncaughtExceptions} from '../handlers/process/uncaughtException'
import {catchSigterm} from '../handlers/process/sigterm'
import {default as catchUnhandledRejections} from '../handlers/process/unhandledRejection'

const Heroku = require('heroku-client');

export enum Environments {
    Development,
    Production
}

export function setupEnvironment() {
    let env;

    if (['live', 'production'].includes(process.env['ENV']!.toLowerCase())) {
        debug.info('Current environment is Production.', "Startup");
        env = Environments.Production;
    }
    else if (process.env.ENV === "DEVELOPMENT") {
        debug.info('Current environment is Development', "Startup");
        env = Environments.Development;
    }
    else {
        debug.error(`Unexpected environment: ${process.env.ENV}, setting environment to DEVELOPMENT.`, "Startup");
        env = Environments.Development;
    }
    gb.ENV = env;
}


// instances
export async function createInstance(bot: Client): Promise<Instance> {
    // this is how we avoid scoping problems, a little ugly but
    // it gets the job done
    // TODO: Smarter Xetera to past Xetera, use singletons or
    // TODO: dependency injections <- this is probably less stupid
    let hifumi = new Cleverbot();
    let database = new Database();
    let muteQueue = new MuteQueue();
    let tracklist = new Tracklist();
    // probably not a good place to have this side effect but whatever
    let messageQueue = new MessageQueue(muteQueue, database, tracklist);
    let commandHandler = new CommandHandler();
    return {
        bot: bot,
        hifumi: hifumi,
        muteQueue: muteQueue,
        database: database,
        messageQueue: messageQueue,
        commandHandler: commandHandler,
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

export function getClient(): Client {
    if (!process.env['BOT_TOKEN']){
        debug.error(
            `MISSING 'BOT_TOKEN' environment variable, ` +
            `use the .env file to fill it in.`

        );
        process.exit(1);
    }
   return new Client();
}

export function setupProcess() {
    catchUncaughtExceptions();
    catchUnhandledRejections();
    catchSigterm(true);
}


