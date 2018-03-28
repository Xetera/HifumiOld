import {Channel, GuildMember, RichEmbed, TextChannel, User} from "discord.js";

declare type channelType = 'dm' | 'group' | 'text' | 'voice' | 'category';
export function resolveType(type: channelType): string{
    switch(type){
        case 'dm':
            return 'DM';
        case 'group':
            return 'Group Chat';
        case 'text':
            return 'Text Channel';
        case 'voice':
            return 'Voice Channel';
        case 'category':
            return 'Category';
    }
}

export default function logChannelCreateEmbed(channel: Channel, creator: User, channelName: string): RichEmbed {
    return new RichEmbed()
        .setTitle(`Channel Created 📖️`)
        .addField(`Channel`, channelName, true)
        .addField(`Responsible Staff`, creator, true)
        .addField(`Type`, resolveType(channel.type), true)
        .setColor('#ddd3ff')
        .setTimestamp()
}