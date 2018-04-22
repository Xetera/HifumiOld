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

setupProcess();
gb.ENV  = getEnvironmentSettings();
// lol @ me passing in "global" variables
const [BOT_TOKEN, CLEVERBOT_TOKEN] : string[] = getTokens(gb.ENV);
const DATABASE_CONFIG : string = getDatabaseConnection(gb.ENV);

main();
async function main(){
    const bot = new Client();
    bot.login(BOT_TOKEN);

    bot.on('ready', async function(){
        gb.ownerID = await onReady(bot);
        gb.instance = await createInstance(bot, BOT_TOKEN, CLEVERBOT_TOKEN, DATABASE_CONFIG);
        gb.instance.trackList.initializeGuilds();
        setInterval(function(){
            updatePresence(bot);
        }, 1000 * 60 * 10);
    });


// === === === === MESSAGE === === === === === //
    bot.on('message', function(message : Discord.Message){
        onMessage(message);
    });

    bot.on('messageUpdate', function(oldMessage: Discord.Message, newMessage: Discord.Message){
        onMessageUpdate(oldMessage, newMessage);
    });

    bot.on('messageDelete', function(oldMessage: Discord.Message, newMessage: Discord.Message){
        // (oldMessage, newMessage);
    });


// === === === === GUILD MEMBER === === === === === //
    bot.on('guildMemberAdd', function(member : Discord.GuildMember){
        onGuildMemberAdd(member);
    });


    bot.on('guildMemberRemove', function(member : Discord.GuildMember){
        onGuildMemberRemove(member);
    });

    bot.on('guildMemberUpdate', function(oldMember: Discord.GuildMember, newMember: Discord.GuildMember){
        onGuildMemberUpdate(oldMember, newMember);
    });


// === === === === GUILD === === === === === //
    bot.on('guildUpdate', function(oldMember: Discord.Guild, newMember: Discord.Guild){
        onGuildUpdate(oldMember, newMember);
    });

    bot.on('guildCreate', function(guild : Discord.Guild){
        onGuildCreate(guild);
    });

    bot.on('guildBanAdd', (guild:Discord.Guild, member: Discord.User) => {
        LogManager.logBan(guild, member);
    });

    bot.on('guildBanRemove', (guild:Discord.Guild, member: Discord.User) => {
        LogManager.logUnban(guild, member);
    });

// === === === === CHANNEL === === === === === //
    bot.on('channelCreate', function(channel :Discord.Channel){
        onChannelCreate(channel)
    });

    bot.on('channelDelete', function(channel :Discord.Channel){
        onChannelDelete(channel);
    });

}
