// modules
import {Alexa} from "./src/API/Alexa";

const config = require('./refactor.json');
const cleverbotAPI = require('./config0.json').CleverbotAPI;
import {MuteQueue} from './src/Moderation/MuteQueue'
import {MessageQueue} from "./src/Moderation/MessageQueue";
import {debug} from './src/Utility/Logging'
import onReady from './src/Events/onReady'
import onMessage from './src/Events/onMessage'
// dependencies
import * as Discord from 'discord.js'


// instances
const bot          : Discord.Client = new Discord.Client();
const alexa        : Alexa          = new Alexa(cleverbotAPI);
const muteQueue    : MuteQueue      = new MuteQueue();
const messageQueue : MessageQueue   = new MessageQueue(muteQueue);

bot.login(config.token);

bot.on('ready', function(){
    onReady(bot);
});

bot.on('message', function(message){
    onMessage(message, alexa, messageQueue);
});