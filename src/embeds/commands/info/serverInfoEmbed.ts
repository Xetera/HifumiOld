import {Guild, RichEmbed} from "discord.js";
import {commandEmbedColor} from "../../../utility/Settings";
import moment = require("moment");

export default function serverInfoEmbed(guild: Guild, onlineUsers: number, textChannelCount: number, voiceChannelCount: number){
    return new RichEmbed()
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
}
