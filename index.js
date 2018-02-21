"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// modules
var Alexa_1 = require("./src/API/Alexa");
require("reflect-metadata");
var config = require('./config0.json');
var cleverbotAPI = require('./config0.json').CleverBotAPI;
var MuteQueue_1 = require("./src/Moderation/MuteQueue");
var MessageQueue_1 = require("./src/Moderation/MessageQueue");
var onReady_1 = require("./src/Events/onReady");
var onMessage_1 = require("./src/Events/onMessage");
// dependencies
var Discord = require("discord.js");
// instances
var bot = new Discord.Client();
var alexa = new Alexa_1.Alexa(cleverbotAPI);
var muteQueue = new MuteQueue_1.MuteQueue();
var messageQueue = new MessageQueue_1.MessageQueue(muteQueue);
bot.login(config.TOKEN);
bot.on('ready', function () {
    onReady_1.default(bot);
});
bot.on('message', function (message) {
    onMessage_1.default(message, alexa, messageQueue, bot);
});
