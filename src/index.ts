import {
    createInstance, getDatabaseConnection, getEnvironmentSettings, getTokens, setupProcess
} from "./events/systemStartup";
import gb from './misc/Globals';
import 'reflect-metadata';
import onReady from './events/onReady'
import onMessage from './events/onMessage'
import onGuildMemberAdd from "./events/onGuildMemberAdd";
import onGuildMemberRemove from "./events/onGuildMemberRemove";
import onGuildCreate from "./events/onGuildCreate";
import updatePresence from "./actions/UpdatePresence";
import onMessageUpdate from "./events/onMessageUpdate";
import onGuildMemberUpdate from "./events/onGuildMemberUpdate";
import onGuildUpdate from "./events/onGuildUpdate";
import {LogManager} from "./handlers/logging/logManager";
import onChannelCreate from "./events/onChannelCreate";
import onChannelDelete from "./events/onChannelDelete";
import {Client} from "discord.js";
import websocketErrorHandler from "./handlers/process/websocketErrorHandler";
import websocketWarningHandler from "./handlers/process/websocketWarningHandler";
import {debug} from "./utility/Logging";

setupProcess();
gb.ENV  = getEnvironmentSettings();
// lol @ me passing in "global" variables
const [BOT_TOKEN, CLEVERBOT_TOKEN] : string[] = getTokens(gb.ENV);
const DATABASE_CONFIG : string = getDatabaseConnection(gb.ENV);

main();

async function main(){
    const bot = new Client();
    debug.info('Logging in...', 'Startup');
    bot.login(BOT_TOKEN);

    bot.on('ready', async() =>{
        gb.ownerID = await onReady(bot);
        gb.instance = await createInstance(bot, BOT_TOKEN, CLEVERBOT_TOKEN, DATABASE_CONFIG);
        gb.instance.trackList.initializeGuilds();
        setInterval(() => {
            updatePresence(bot);
        }, 1000 * 60 * 10);
    });

// === === === === MESSAGE === === === === === //
    bot.on('message', onMessage);

    bot.on('messageUpdate', onMessageUpdate);

    bot.on('messageDelete', () => {});

// === === === === GUILD MEMBER === === === === === //
    bot.on('guildMemberAdd', onGuildMemberAdd);

    bot.on('guildMemberRemove', onGuildMemberRemove);

    bot.on('guildMemberUpdate', onGuildMemberUpdate);

// === === === === GUILD === === === === === //
    bot.on('guildUpdate', onGuildUpdate);

    bot.on('guildCreate', onGuildCreate);

    bot.on('guildBanAdd', LogManager.logBan);

    bot.on('guildBanRemove', LogManager.logUnban);

// === === === === CHANNEL === === === === === //
    bot.on('channelCreate', onChannelCreate);

    bot.on('channelDelete',onChannelDelete);

// === === === === EXCEPTIONS === === === === === //
    bot.on('error', websocketErrorHandler);

    bot.on('warn', websocketWarningHandler);
}
