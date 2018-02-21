"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dbg = require("debug");
var Discord = require("discord.js");
exports.debug = {
    silly: dbg('Bot:Silly'),
    info: dbg("Bot:Info"),
    warning: dbg('Bot:Warning'),
    error: dbg("Bot:Error")
};
function log(guild, message) {
    var logsChannel = guild.channels.find('name', 'logs');
    if (!logsChannel) {
        return exports.debug.info("Tried to log a message in " + guild.name + " but a logs channel was not found.");
    }
    if (logsChannel instanceof Discord.TextChannel) {
        logsChannel.send('\`\`\`\n' + message + '\`\`\`');
        return exports.debug.info("Logged a message in " + guild.name);
    }
}
exports.log = log;
