import {Database} from "./src/Database/Database";

declare let process : {
    env: {
        BOT_TOKEN: string,
        CLEVERBOT_TOKEN: string
    }
};

let BOT_TOKEN : string;
let CLEVERBOT_TOKEN : string;

if (process.env.BOT_TOKEN !== undefined && process.env.CLEVERBOT_TOKEN !== undefined){
    // settings for heroku
    BOT_TOKEN = process.env.BOT_TOKEN;
    CLEVERBOT_TOKEN = process.env.CLEVERBOT_TOKEN;
} else {
    // settings for development
    BOT_TOKEN = require('./config0.json').TOKEN;
    CLEVERBOT_TOKEN = require('./config0.json').CleverBotAPI;
}

// modules
import {Alexa} from "./src/API/Alexa";
import {MuteQueue} from './src/Moderation/MuteQueue'
import {MessageQueue} from "./src/Moderation/MessageQueue";
import {debug} from './src/Utility/Logging'
import onReady from './src/Events/onReady'
import onMessage from './src/Events/onMessage'
// dependencies
import * as Discord from 'discord.js'
import onGuildMemberAdd from "./src/Events/onGuildMemberAdd";
import onGuildMemberRemove from "./src/Events/onGuildMemberRemove";
import onGuildCreate from "./src/Events/onGuildCreate";


// instances
const bot          : Discord.Client = new Discord.Client();
const alexa        : Alexa          = new Alexa(CLEVERBOT_TOKEN);
const muteQueue    : MuteQueue      = new MuteQueue();
const messageQueue : MessageQueue   = new MessageQueue(muteQueue);
const db           : Database       = new Database();
bot.login(BOT_TOKEN);

bot.on('ready', function(){
    onReady(bot);
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