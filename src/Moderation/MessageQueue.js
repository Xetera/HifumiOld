"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = require("discord.js");
var moment = require("moment");
var Settings_1 = require("../Utility/Settings");
var dbg = require("debug");
var debug = {
    silly: dbg('Bot:MessageQueue:Silly'),
    info: dbg('Bot:MessageQueue:Info'),
    warning: dbg('Bot:MessageQueue:Warning'),
    error: dbg('Bog:MessageQueue:Error')
};
var MessageQueue = /** @class */ (function () {
    function MessageQueue(muteQueue, size) {
        this.muteQueue = muteQueue;
        this.queue = new Map();
        this.bufferLength = size ? size : 200;
        debug.info('MessageQueue is ready.');
    }
    MessageQueue.prototype.add = function (msg) {
        var self = this;
        msg.sent = moment(new Date()).toDate();
        var guild = this.queue.get(msg.guild);
        if (guild === undefined) {
            this.queue.set(msg.guild, [msg]);
        }
        else {
            guild.push(msg);
        }
        this.queue.forEach(function (value, key, map) {
            //  value.length => length of messages stored in the message queue
            if (value.length > self.bufferLength) {
                var temp = value.shift();
                if (temp === undefined)
                    debug.error("Tried to shift out an empty message from " + key.name + "'s messageQueue" +
                        "\nMost likely because buffer length is 0 or undefined.");
            }
        });
        this.checkForSpam(msg.member);
    };
    //gets called every messages
    MessageQueue.prototype.checkForSpam = function (member) {
        var spamMessages = this.getRecentUserMessages(member);
        if (spamMessages == null)
            return;
        var isUserSpamming = spamMessages.length > Settings_1.getSpamTolerance();
        if (isUserSpamming) {
            this.removeUserMessages(spamMessages);
            var unmuteDate = Settings_1.getMuteDate();
            var mutedRole = member.guild.roles.find('name', 'muted');
            this.muteQueue.add(member, mutedRole, unmuteDate);
        }
    };
    MessageQueue.prototype.removeUserMessages = function (messages) {
        // guaranteed that all messages are by the same author so we can just take the first index
        var member = messages[0].member;
        var memberName = messages[0].member.nickname || messages[0].author.username;
        var guild = messages[0].guild;
        // breaking down all the unique channels
        // guaranteed that all messages are in the same guild
        if (Settings_1.securityLevel === Settings_1.SecurityLevels.High) {
            debug.silly('Removing spammer in high security mode');
            var allMessages = this.getAllUserMessages(member);
            if (messages !== undefined) {
            }
        }
        // in case user is spamming in more than one channel
        var channelIDs = Array.from(new Set(messages.map(function (message) { return message.channel.id; })));
        var _loop_1 = function (channelID) {
            var targetChannel = guild.channels.find('id', channelID);
            if (targetChannel instanceof Discord.TextChannel) {
                var channelMessages = messages.filter(function (msg) { return msg.channel.id === targetChannel.id; });
                // delete everything in channel
                targetChannel.bulkDelete(channelMessages);
                var guildMessages = this_1.queue.get(guild);
                if (guildMessages === undefined)
                    return { value: debug.error("Tried to get " + guild.name + " messages in MessageQueue but key does not exist.") };
                for (var i in messages) {
                    try {
                        guildMessages.splice(guildMessages.findIndex(function (msg) { return msg.id === messages[i].id; }), 1);
                    }
                    catch (error) {
                        debug.error("Error splicing array for " + guild.name + "'s messages in MessageQueue");
                    }
                }
                debug.info("Deleted " + messages.length + " messages from " + memberName + " in " + targetChannel.name);
            }
        };
        var this_1 = this;
        for (var _i = 0, channelIDs_1 = channelIDs; _i < channelIDs_1.length; _i++) {
            var channelID = channelIDs_1[_i];
            var state_1 = _loop_1(channelID);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    MessageQueue.prototype.getRecentUserMessages = function (member) {
        var guild = member.guild;
        var tolerance = moment(new Date()).subtract(5, 's').toDate();
        var messages = this.queue.get(guild);
        if (messages === undefined) {
            debug.error("Tried fetching recent messages in a nonexistent server");
            return;
        }
        return messages.filter(function (message) {
            return message.author.id === member.user.id && message.guild.id === member.guild.id && message.sent > tolerance;
        });
    };
    MessageQueue.prototype.getAllUserMessages = function (member) {
        var messages = this.queue.get(member.guild);
        if (messages === undefined)
            return debug.error("Guild " + member.guild + " has no messages to get");
        return messages.filter(function (message) {
            return message.author.id === member.id;
        });
    };
    MessageQueue.prototype.getMutedRole = function (guild) {
    };
    MessageQueue.prototype.getQueue = function (channel) {
        var output = "";
        if (channel instanceof Discord.TextChannel) {
            var guild = channel.guild;
            var messages = this.queue.get(guild);
            if (messages === undefined)
                return;
            var messageCount = 0;
            for (var i in messages) {
                if (messageCount > 200)
                    break;
                output += messages[i].author.username + ": " + messages[i].content + "\n";
                messageCount++;
            }
            channel.send(output);
        }
    };
    return MessageQueue;
}());
exports.MessageQueue = MessageQueue;
