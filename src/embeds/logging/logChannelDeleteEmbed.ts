import {Channel, RichEmbed,User} from "discord.js";
import {resolveType} from "./logChannelCreateEmbed";


export default function logChannelDeleteEmbed(channel: Channel, creator: User, channelName: string): RichEmbed {
    return new RichEmbed()
        .setTitle(`Channel Deleted 📘`)
        .addField(`Channel`, channelName, true)
        .addField(`Responsible Staff`, creator, true)
        .addField(`Type`, resolveType(channel.type), true)
        .setColor('#af17ff')
        .setTimestamp()
}
