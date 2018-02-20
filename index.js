"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// modules
var config = require('./refactor.json');
var onReady_1 = require("./src/Events/onReady");
// dependencies
var Discord = require("discord.js");
var bot = new Discord.Client();
bot.login(config.token);
bot.on('ready', function () {
    onReady_1.default(bot);
});
