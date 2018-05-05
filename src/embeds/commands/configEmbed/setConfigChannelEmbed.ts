import {Channel, RichEmbed} from "discord.js";

export const ConfigChannelEmojis: {[id: string]: string}  = {
    logs: '📑',
    warnings: '⚠',
    welcome: '👋',
    chat: '🗣',
    suggestions: '❓'
};

export type ConfigChannelType = 'logs' | 'warnings' | 'welcome' | 'chat' | 'suggestions';

export default function setConfigChannelEmbed(channel: Channel, type: ConfigChannelType){
    const emoji = ConfigChannelEmojis[type];
    return new RichEmbed()
        .setTitle(`Setting Saved! ${emoji}`)
        .setDescription(`Alrighty, I set your ${type} channel to ${channel}.`)
}
