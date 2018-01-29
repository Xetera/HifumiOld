const Discord = require('discord.js');
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

