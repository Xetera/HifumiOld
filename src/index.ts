import {
    getClient,
    setupEnvironment, setupProcess
} from "./events/systemStartup";
import 'reflect-metadata';
import onReady from './events/onReady'
import onMessage from './events/onMessage'
import onGuildMemberAdd from "./events/onGuildMemberAdd";
import onGuildMemberRemove from "./events/onGuildMemberRemove";
import onGuildCreate from "./events/onGuildCreate";
import onMessageUpdate from "./events/onMessageUpdate";
import onGuildMemberUpdate from "./events/onGuildMemberUpdate";
import onGuildUpdate from "./events/onGuildUpdate";
import {LogManager} from "./handlers/logging/logManager";
import onChannelCreate from "./events/onChannelCreate";
import onChannelDelete from "./events/onChannelDelete";
import websocketErrorHandler from "./handlers/process/websocketErrorHandler";
import websocketWarningHandler from "./handlers/process/websocketWarningHandler";
import * as dotenv from 'dotenv';
import {debug} from "./utility/Logging";

(async function main(){
    dotenv.config();
    setupProcess();
    setupEnvironment();

    const bot = getClient();

    debug.info('Logging in...', 'Startup');
    bot.login(process.env['BOT_TOKEN']);

    bot.on('ready',() =>  onReady(bot));

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
})();
