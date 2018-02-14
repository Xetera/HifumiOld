const Discord = require('discord.js');
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @constructor
 */

function Ping(bot, message){
    let color;
    if (bot.ping > 300) {
        color = "RED";
    }
    else if (bot.ping > 200) {
        color = "DARK ORANGE"
    }
    else if (bot.ping > 100) {
        color = "ORANGE";
    }
    else if (bot.ping > 50) {
        color = "GREEN";
    }
    let member = message.member;
    let embed = new Discord.RichEmbed()
        .setAuthor(member.displayName, member.user.displayAvatarURL)
        .setTimestamp()
        .setColor(color)
        .setTitle(`${bot.ping} ms.`);
    message.channel.send(embed);
}

Ping.prototype.description = "Sends ping information.";
exports.Ping = Ping;