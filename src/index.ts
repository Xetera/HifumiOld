import {createInstance, getDatabaseConnection, getEnvironmentSettings, getTokens} from "./events/systemStartup";
import gb from './misc/Globals';

gb.ENV  = getEnvironmentSettings();

// lol @ me passing in "global" variables
const [BOT_TOKEN, CLEVERBOT_TOKEN] : string[] = getTokens(gb.ENV);
const DATABASE_CONFIG : DatabaseConfig = getDatabaseConnection(gb.ENV);


// modules
import {DatabaseConfig} from "./database/Database";
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


const instance = createInstance(BOT_TOKEN, CLEVERBOT_TOKEN, DATABASE_CONFIG);
gb.instance = instance;


setInterval(function(){
    updatePresence(instance.bot);
}, 1000 * 60 * 10);

instance.bot.on('ready', async function(){
    gb.ownerID = await onReady(instance);
});


// === === === === MESSAGE === === === === === //
instance.bot.on('message', function(message : Discord.Message){
    onMessage(message, instance);
});

instance.bot.on('messageUpdate', function(oldMessage: Discord.Message, newMessage: Discord.Message){
    onMessageUpdate(oldMessage, newMessage);
});

instance.bot.on('messageDelete', function(oldMessage: Discord.Message, newMessage: Discord.Message){
    // (oldMessage, newMessage);
});


// === === === === GUILD MEMBER === === === === === //
instance.bot.on('guildMemberAdd', function(member : Discord.GuildMember){
    onGuildMemberAdd(member, instance);
});


instance.bot.on('guildMemberRemove', function(member : Discord.GuildMember){
    onGuildMemberRemove(member);
});

instance.bot.on('guildMemberUpdate', function(oldMember: Discord.GuildMember, newMember: Discord.GuildMember){
    onGuildMemberUpdate(oldMember, newMember);
});


// === === === === GUILD === === === === === //
instance.bot.on('guildUpdate', function(oldMember: Discord.Guild, newMember: Discord.Guild){
    onGuildUpdate(oldMember, newMember);
});

instance.bot.on('guildCreate', function(guild : Discord.Guild){
    onGuildCreate(guild, instance);
});

instance.bot.on('guildBanAdd', (guild:Discord.Guild, member: Discord.User) => {
    LogManager.logBan(guild, member);
});

instance.bot.on('guildBanRemove', (guild:Discord.Guild, member: Discord.User) => {
    LogManager.logUnban(guild, member);
});

// === === === === CHANNEL === === === === === //
instance.bot.on('channelCreate', function(channel :Discord.Channel){
    LogManager.logChannelCreate(channel);
});

instance.bot.on('channelDelete', function(channel :Discord.Channel){
    LogManager.logChannelDelete(channel);
});
