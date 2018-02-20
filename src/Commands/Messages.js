const Discord = require('discord.js');
const config = require('../../config0');
const debug = require('../../Debug').debug;

/**
 *
 * @param {Discord.Message} message
 * @param {Discord.Client} bot
 */
exports.middleWare = function(message, bot, alexa) {

};

exports.sendErrorEmber = function(){

};

let fireAlexaRequest = function(message, alexa, removeAlexa=true){
    if (removeAlexa)
        message.content = message.content.replace(/alexa/i, '');
    message.react('👀');
    getAlexaResponse(message.content)
        .then(response => {
            message.channel.send(response.message);
        });
};

let getAlexaResponse = function(request, alexa){
    return new Promise(function(resolve, reject){
        alexa.say(request, function(response){
            resolve(response);
        });
    });
};

