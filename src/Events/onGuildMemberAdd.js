"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = require("discord.js");
var dbg = require("debug");
var Util_1 = require("../Utility/Util");
var Replies_1 = require("../Handlers/Replies");
exports.debug = {
    silly: dbg('Bot:onGuildMemberAdd:Silly'),
    info: dbg('Bot:onGuildMemberAdd:Info'),
    warning: dbg('Bot:onGuildMemberAdd:Warning'),
    error: dbg('Bot:onGuildMemberAdd:Error')
};
function onGuildMemberAdd(member) {
    // we will change this later to fetch from a database instead of using a preset name
    var welcomeChannel = member.guild.channels.find('name', 'welcome');
    var defaultChannel = member.guild.systemChannel;
    var identifier = member.user.bot ? 'A new bot' : 'A new human';
    var welcomeMessage = Util_1.randChoice(Replies_1.welcomeMessages);
    if (welcomeChannel === undefined) {
        return exports.debug.info("Could not send a member join message to " + member.guild.name + " " +
            "because a welcome channel was missing.");
    }
    if (welcomeChannel instanceof Discord.TextChannel) {
        var welcomeChannelEmbed = new Discord.RichEmbed()
            .setAuthor(member.displayName, member.user.displayAvatarURL)
            .setTimestamp()
            .setColor("GREEN")
            .setTitle(identifier + " has joined the server!");
        welcomeChannel.send(welcomeChannelEmbed);
    }
    // TODO: This is currently inconsistent, turn this into a database setting later
    if (defaultChannel && defaultChannel instanceof Discord.TextChannel) {
        var defaultChannelEmbed = new Discord.RichEmbed()
            .setAuthor(member.displayName, member.user.displayAvatarURL)
            .setTimestamp()
            .setColor("Green")
            .setTitle(identifier + " has joined the server!")
            .setDescription(welcomeMessage);
        defaultChannel.send(defaultChannelEmbed);
    }
}
exports.default = onGuildMemberAdd;
