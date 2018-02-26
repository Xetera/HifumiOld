import {Environments, getDatabaseConnection, getEnvironmentSettings, getTokens} from "./src/Events/systemStartup";

const ENV : Environments = getEnvironmentSettings();
const [BOT_TOKEN, CLEVERBOT_TOKEN] : string[] = getTokens(ENV);

const DATABASE_URL : DatabaseConfig = getDatabaseConnection(ENV);


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
import gb from './src/Misc/Globals';

// instances
const bot          : Discord.Client = new Discord.Client();
const alexa        : Alexa          = new Alexa(CLEVERBOT_TOKEN);
const muteQueue    : MuteQueue      = new MuteQueue();
const messageQueue : MessageQueue   = new MessageQueue(muteQueue);
const db           : Database       = new Database(DATABASE_URL);



bot.login(BOT_TOKEN);

bot.on('ready', async function(){
    gb.ownerID = await onReady(bot);
});

bot.on('message', function(message : Discord.Message){
    onMessage(message, alexa, messageQueue, bot, db);
});

bot.on('guildMemberAdd', function(member : Discord.GuildMember){
    onGuildMemberAdd(member);
});

bot.on('guildMemberRemove', function(member : Discord.GuildMember){
    onGuildMemberRemove(member);
});

bot.on('guildCreate', function(guild : Discord.Guild){
    onGuildCreate(guild, db);
});