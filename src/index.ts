
import {
    createInstance, getDatabaseConnection, getEnvironmentSettings, getTokens,
    setupProcess
} from "./events/systemStartup";
import gb from './misc/Globals';
import 'reflect-metadata';
import onReady from './events/onReady'
import onMessage from './events/onMessage'
import onGuildMemberAdd from "./events/onGuildMemberAdd";
import onGuildMemberRemove from "./events/onGuildMemberRemove";
import onGuildCreate from "./events/onGuildCreate";
import * as Discord from 'discord.js'
import updatePresence from "./actions/UpdatePresence";
import onMessageUpdate from "./events/onMessageUpdate";
import onGuildMemberUpdate from "./events/onGuildMemberUpdate";
import onGuildUpdate from "./events/onGuildUpdate";
import {LogManager} from "./handlers/logging/logManager";
import onChannelCreate from "./events/onChannelCreate";
import onChannelDelete from "./events/onChannelDelete";
import {Client} from "discord.js";
import uncaughtException from "./handlers/process/uncaughtException";
import websocketErrorHandler from "./handlers/process/websocketErrorHandler";
import websocketWarningHandler from "./handlers/process/websocketWarningHandler";

setupProcess();
gb.ENV  = getEnvironmentSettings();
// lol @ me passing in "global" variables
const [BOT_TOKEN, CLEVERBOT_TOKEN] : string[] = getTokens(gb.ENV);
const DATABASE_CONFIG : string = getDatabaseConnection(gb.ENV);

main();

async function main(){
    const bot = new Client();
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
    bot.on('message', (message : Discord.Message) => {
        onMessage(message);
    });

    bot.on('messageUpdate', (oldMessage: Discord.Message, newMessage: Discord.Message) => {
        onMessageUpdate(oldMessage, newMessage);
    });

    bot.on('messageDelete', (oldMessage: Discord.Message, newMessage: Discord.Message) => {
        // (oldMessage, newMessage);
    });


// === === === === GUILD MEMBER === === === === === //
    bot.on('guildMemberAdd', (member : Discord.GuildMember) => {
        onGuildMemberAdd(member);
    });


    bot.on('guildMemberRemove', (member : Discord.GuildMember) => {
        onGuildMemberRemove(member);
    });

    bot.on('guildMemberUpdate', (oldMember: Discord.GuildMember, newMember: Discord.GuildMember) => {
        onGuildMemberUpdate(oldMember, newMember);
    });


// === === === === GUILD === === === === === //
    bot.on('guildUpdate', (oldMember: Discord.Guild, newMember: Discord.Guild) => {
        onGuildUpdate(oldMember, newMember);
    });

    bot.on('guildCreate', (guild : Discord.Guild) => {
        onGuildCreate(guild);
    });

    bot.on('guildBanAdd', (guild:Discord.Guild, member: Discord.User) => {
        LogManager.logBan(guild, member);
    });

    bot.on('guildBanRemove', (guild:Discord.Guild, member: Discord.User) => {
        LogManager.logUnban(guild, member);
    });

// === === === === CHANNEL === === === === === //
    bot.on('channelCreate', (channel :Discord.Channel) => {
        onChannelCreate(channel)
    });

    bot.on('channelDelete', (channel :Discord.Channel) => {
        onChannelDelete(channel);
    });

// === === === === EXCEPTIONS === === === === === //
    bot.on('error', (err) => websocketErrorHandler(err));

    bot.on('warn', (warning) => websocketWarningHandler(warning));
}
