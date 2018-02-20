"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require('./../../config0.json');
var Discord = require("discord.js");
var clevertype_1 = require("clevertype");
var logging_1 = require("../../logging");
var Alexa = /** @class */ (function () {
    function Alexa(apiKey) {
        this.identifier = /alexa/i;
        this.cleverbot = new clevertype_1.Cleverbot(apiKey);
    }
    Alexa.prototype.replaceKeyword = function (phrase) {
        return phrase.replace(this.identifier, 'cleverbot');
    };
    Alexa.prototype.setEmotion = function (mood) {
        this.cleverbot.setEmotion(mood);
    };
    Alexa.prototype.setEngagement = function (mood) {
        this.cleverbot.setEngagement(mood);
    };
    Alexa.prototype.setRegard = function (mood) {
        this.cleverbot.setRegard(mood);
    };
    Alexa.prototype.checkMessage = function (message, bot) {
        var alexaRequest = message.content.match(/alexa/i);
        if (message.channel instanceof Discord.TextChannel) {
            if (message.channel.name === 'chat-with-alexa' || alexaRequest || message.isMentioned(bot.user)) {
                // don't respond to messages not meant for me
                if (message.mentions.users.array().length !== 0 && !message.isMentioned(bot.user))
                    return;
                else if (message.content.startsWith('-'))
                    return;
                logging_1.debug.info((message.member.nickname || message.author.username) + " from guild " + message.member.guild + " mentioned me in " + message.channel.name);
                message.react('👀');
                var response = void 0;
                if (message.channel.name === 'chat-with-alexa')
                    this.say(message.content, false).then(function (resp) {
                        message.channel.send(resp);
                    });
                else
                    this.say(message.content).then(function (resp) {
                        message.channel.send(resp);
                    });
            }
        }
    };
    Alexa.prototype.say = function (phrase, replaceKeyword) {
        if (replaceKeyword === void 0) { replaceKeyword = true; }
        var that = this;
        return new Promise(function (resolve, reject) {
            var parsedArg;
            if (replaceKeyword)
                parsedArg = that.replaceKeyword(phrase);
            else
                parsedArg = phrase;
            that.cleverbot.say(parsedArg).then(function (response) {
                resolve(response);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    Alexa.prototype.getMood = function () {
        return this.cleverbot.mood;
    };
    return Alexa;
}());
exports.Alexa = Alexa;
