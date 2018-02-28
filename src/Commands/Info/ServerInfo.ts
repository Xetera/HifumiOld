import * as Discord from 'discord.js'
import {Presence, RichEmbed} from "discord.js";

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
        .setTitle(guild.name)
        .addField(`Owner`, guild.owner)
        .addField(`Members`, `${onlineUsers}/${guild.memberCount}`)
        .addField(`Text Channels`, textChannelCount)
        .addField(`Voice Channels`, voiceChannelCount)
        .setTimestamp()
    ).catch(err => {
        console.log(err);
    });
}