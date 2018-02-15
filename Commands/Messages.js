const Discord = require('discord.js');
const cleverBot = require('cleverbot-node');
const config = require('./../config0');
const debug = require('./../Debug').debug;
const Alexa = new cleverBot();

Alexa.configure({botapi: config.CleverBotAPI});

/**
 * @param {string} message - message
 * @param {number} timeoutDuration
 *
 *
 */
Discord.Channel.prototype.sendAndRemove = function(message, timeoutDuration){
   this.send(message).then(msg => {
       msg.delete(timeoutDuration * 1000);
   })
};

/**
 *
 * @param {Discord.Message} message
 * @param {Discord.Client} bot
 */
exports.middleWare = function(message, bot) {
    let alexaRequest = message.content.match(/alexa/i);

    if (message.channel.name === 'chat-with-alexa' || alexaRequest || message.isMentioned(bot.user)) {
        // don't respond to messages not meant for me
        if (message.mentions.users.array().length !== 0 && !message.isMentioned(bot.user)) return;
        else if (message.content.startsWith('-')) return;

        debug.info(`${message.member.nickname || message.author.username} mentioned me in ${message.channel.name}`);

        if (message.channel.name === 'chat-with-alexa') fireAlexaRequest(message, false);
        else fireAlexaRequest(message)
    }
};

exports.sendErrorEmber = function(){

};

let fireAlexaRequest = function(message, removeAlexa=true){
    if (removeAlexa)
        message.content = message.content.replace(/alexa/i, '');
    message.react('👀');
    getAlexaResponse(message.content)
        .then(response => {
            message.channel.send(response.message);
        });
};

let getAlexaResponse = function(request){
    return new Promise(function(resolve, reject){
        Alexa.write(request, function(response){
            resolve(response);
        })
    })

};

