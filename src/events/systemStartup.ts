import {PostgresLiveLoginConfig, PostgresDevLoginConfig} from "../database/Database";
import gb from "../misc/Globals";
import {Client, Guild} from "discord.js";
import {debug} from '../utility/Logging'

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

export function setGlobals(bot : Client){
    const emojiServer : Guild = bot.guilds.find('id', '418699380833648642');
    gb.emojis = emojiServer.emojis;
}