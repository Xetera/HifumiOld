"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BOT_TOKEN;
var CLEVERBOT_TOKEN;
if (process.env.BOT_TOKEN !== undefined && process.env.CLEVERBOT_TOKEN !== undefined) {
    // settings for heroku
    BOT_TOKEN = process.env.BOT_TOKEN;
    CLEVERBOT_TOKEN = process.env.CLEVERBOT_TOKEN;
}
else {
    // settings for development
    BOT_TOKEN = require('./config0.json').TOKEN;
    CLEVERBOT_TOKEN = require('./config0.json').CleverBotAPI;
}
// modules
var Alexa_1 = require("./src/API/Alexa");
require("reflect-metadata");
var MuteQueue_1 = require("./src/Moderation/MuteQueue");
var MessageQueue_1 = require("./src/Moderation/MessageQueue");
var onReady_1 = require("./src/Events/onReady");
var onMessage_1 = require("./src/Events/onMessage");
// dependencies
var Discord = require("discord.js");
var onGuildMemberAdd_1 = require("./src/Events/onGuildMemberAdd");
var onGuildMemberRemove_1 = require("./src/Events/onGuildMemberRemove");
// instances
var bot = new Discord.Client();
var alexa = new Alexa_1.Alexa(CLEVERBOT_TOKEN);
var muteQueue = new MuteQueue_1.MuteQueue();
var messageQueue = new MessageQueue_1.MessageQueue(muteQueue);
bot.login(BOT_TOKEN);
bot.on('ready', function () {
    onReady_1.default(bot);
});
bot.on('message', function (message) {
    onMessage_1.default(message, alexa, messageQueue, bot);
});
bot.on('guildMemberAdd', function (member) {
    onGuildMemberAdd_1.default(member);
});
bot.on('guildMemberRemove', function (member) {
    onGuildMemberRemove_1.default(member);
});
