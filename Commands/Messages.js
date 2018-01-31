const Discord = require('discord.js');
const cleverBot = require('cleverbot-node');
const config = require('./../config0');
const Alexa = new cleverBot;
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

    if (message.channel.name === 'chat-with-alexa') {
        if (message.mentions.users.array().length !== 0 && !message.isMentioned(bot.user)) return;
        else if (message.content.startsWith('-')) return;
        console.log("Heard my name");
        fireAlexaRequest(message, false);
    }
    else if (alexaRequest) {
        console.log("Heard my name");
        fireAlexaRequest(message);
    }
    else if (message.isMentioned(bot.user)) {
        console.log("Heard my name");
        fireAlexaRequest(message);
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

