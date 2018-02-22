"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = require("discord.js");
var dbg = require("debug");
exports.debug = {
    silly: dbg('Bot:onGuildMemberRemove:Silly'),
    info: dbg('Bot:onGuildMemberRemove:Info'),
    warning: dbg('Bot:onGuildMemberRemove:Warning'),
    error: dbg('Bot:onGuildMemberRemove:Error')
};
function onGuildMemberRemove(member) {
    // we will change this later to fetch from a database instead of using a preset name
    var welcomeChannel = member.guild.channels.find('name', 'welcome');
    var identifier = member.user.bot ? 'A bot' : 'A human';
    if (welcomeChannel === undefined) {
        return exports.debug.info("Could not send a member leave message to " + member.guild.name + " " +
            "because a welcome channel was missing.");
    }
    else if (welcomeChannel instanceof Discord.TextChannel) {
        var embed = new Discord.RichEmbed()
            .setAuthor(member.displayName, member.user.displayAvatarURL)
            .setTimestamp()
            .setColor("RED")
            .setTitle(identifier + " just left the server.");
        welcomeChannel.send(embed);
    }
}
exports.default = onGuildMemberRemove;
