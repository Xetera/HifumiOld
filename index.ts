import {getDatabaseConnection, getEnvironmentSettings, getTokens} from "./src/Events/systemStartup";
import gb, {Instance} from './src/Misc/Globals';

gb.ENV  = getEnvironmentSettings();
// lol @ me passing in "global" variables
const [BOT_TOKEN, CLEVERBOT_TOKEN] : string[] = getTokens(gb.ENV);

const DATABASE_URL : DatabaseConfig = getDatabaseConnection(gb.ENV);


// modules
import {Database, DatabaseConfig} from "./src/Database/Database";
import {Alexa} from "./src/API/Alexa";
import {MuteQueue} from './src/Moderation/MuteQueue'
import {MessageQueue} from "./src/Moderation/MessageQueue";
import onReady from './src/Events/onReady'
import onMessage from './src/Events/onMessage'
import onGuildMemberAdd from "./src/Events/onGuildMemberAdd";
import onGuildMemberRemove from "./src/Events/onGuildMemberRemove";
import onGuildCreate from "./src/Events/onGuildCreate";

import * as Discord from 'discord.js'
import onChannelCreate from "./src/Events/onChannelCreate";
import updatePresence from "./src/Actions/UpdatePresence";

// instances

const muteQueue    : MuteQueue      = new MuteQueue();

const instance : Instance = {
    bot         : new Discord.Client(),
    alexa       : new Alexa(CLEVERBOT_TOKEN),
    // otherwise throws no-implicit-any exception
    muteQueue   : muteQueue,
    messageQueue: new MessageQueue(muteQueue),
    database    : new Database(DATABASE_URL)
};





instance.bot.login(BOT_TOKEN);

setInterval(function(){
    updatePresence(instance.bot);
}, 1000 * 60 * 10);

instance.bot.on('ready', async function(){
    gb.ownerID = await onReady(instance);
});

instance.bot.on('message', function(message : Discord.Message){
    onMessage(message, instance);
});

instance.bot.on('guildMemberAdd', function(member : Discord.GuildMember){
    onGuildMemberAdd(member, instance);
});

instance.bot.on('guildMemberRemove', function(member : Discord.GuildMember){
    onGuildMemberRemove(member);
});

instance.bot.on('guildCreate', function(guild : Discord.Guild){
    onGuildCreate(guild, instance);
});

instance.bot.on('channelCreate', function(channel :Discord.Channel){
    onChannelCreate(channel);
});