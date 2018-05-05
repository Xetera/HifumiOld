import * as Discord from 'discord.js'
import {Presence, RichEmbed} from "discord.js";
import {commandEmbedColor} from "../../utility/Settings";
import moment = require("moment");

export default function serverInfo(message : Discord.Message) : void {
    if (!message.guild.available) return;
    const guild = message.guild;
    const voiceChannelCount = guild.channels.filter(channel =>
        channel.type === 'voice'
    ).array().length;
    const textChannelCount = guild.channels.filter(channel =>
        channel.type === 'text'
    ).array().length;
    const onlineUsers = guild.members.filter(member => {
        return member.presence.status  === 'online' || member.presence.status === 'idle'
    }).size;
    message.channel.send(
        new RichEmbed()
        .setThumbnail(guild.iconURL)
        .setColor(commandEmbedColor)
        .setTitle(guild.name)
        .setDescription(`**FAQ:** [Wtf is that date format?](https://en.wikipedia.org/wiki/ISO_8601)`)
        .addField(`Owner`, guild.owner, true)
        .addField(`Members`, `${onlineUsers}/${guild.memberCount}`, true)
        .addField(`Region`, guild.region, true)
        .addField(`Roles`, guild.roles.size, true)
        .addField(`Text Channels`, textChannelCount, true)
        .addField(`Voice Channels`, voiceChannelCount, true)
        .addField(`Created at`, moment(guild.createdTimestamp).format('YYYY/MM/DD'), true)
        .setTimestamp()
    ).catch(err => {
        console.log(err);
    });
}
