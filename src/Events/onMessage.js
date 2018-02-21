"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dbg = require("debug");
var InviteListener_1 = require("../Listeners/InviteListener");
var moment = require("moment");
exports.debug = {
    silly: dbg('Bot:onMessage'),
    info: dbg('Bot:onMessage:Info'),
    warning: dbg('Bot:onMessage:Warning'),
    error: dbg('Bot:onMessage:Error')
};
function middleWare(msg, alexa, messageQueue, bot) {
    //casting
    var message = msg;
    message.sent = moment(new Date()).toDate();
    // we don't want to look at bot messages at all
    messageQueue.add(message);
    alexa.checkMessage(message, bot);
    InviteListener_1.default(message);
}
function onMessage(msg, alexa, messageQueue, bot) {
    if (msg.author.bot)
        return;
    middleWare(msg, alexa, messageQueue, bot);
    // we will change this later to fetch and cache prefixes on a per-server basic
    if (!msg.content.startsWith('.'))
        return;
    exports.debug.info("[" + msg.guild.name + "] " + msg.author.username + " wrote: " + msg.content);
}
exports.default = onMessage;
