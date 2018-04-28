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
    }).array().length;
    message.channel.send(
        new RichEmbed()
        .setThumbnail(guild.iconURL)
        .setColor(commandEmbedColor)
        .setTitle(guild.name)
        .addField(`Owner`, guild.owner, true)
        .addField(`Members`, `${onlineUsers}/${guild.memberCount}`, true)
        .addField(`Text Channels`, textChannelCount, true)
        .addField(`Voice Channels`, voiceChannelCount, true)
            .addField(`Created at`, moment(guild.createdTimestamp).format('YYYY/MM/DD'))
        .setTimestamp()
    ).catch(err => {
        console.log(err);
    });
}
