import {
    Channel,
    Collection, DMChannel,
    Guild,
    GuildMember,
    Message,
    MessageMentions,
    TextChannel,
    User,
    VoiceChannel
} from "discord.js";
import {debug} from "../utility/Logging";
import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
import conflictOnChannelResolveEmbed from "../embeds/resolvers/conflictOnChannelResolveEmbed";
import {AllChannelTypes} from "../decorators/expect";
import resolveNumberedUncertainty from "./resolveNumberedUncertainty";

export async function channelResolver(arg: string, message: Message, channelType: AllChannelTypes, onlyMention: boolean = false, fail: boolean = true): Promise<Channel | undefined> {
    if (channelType === typeof DMChannel){
        return;
    }

    else if (message.mentions.channels.size || arg.match(MessageMentions.CHANNELS_PATTERN)) {
        return message.mentions.channels.array().shift();
    }
    else if (onlyMention && fail){
        return void handleFailedCommand(
            message.channel, `This command requires a channel mention.`
        )
    }
    else if (onlyMention){
        return;
    }

    const resolvedChannels = <TextChannel[] & VoiceChannel[]> message.guild.channels.array().reduce((arr: Channel[], c: Channel) => {
        /**
         * 3 types of classes extend Channel
         * - DMChannel
         * - TextChannel
         * - VoiceChannel
         * = DMChannel does not contain name
         * = This is just for static check purposes, we will
         * = never actually encounter a DMChannel in this function
         */
        if (!(c instanceof TextChannel) && !(c instanceof VoiceChannel)){
            return arr;
        }
        if (c.name.toLowerCase().includes(arg.toLowerCase()) || c.id === arg){
            arr.push(c);
        }
        return arr;
    }, <(TextChannel | VoiceChannel)[]>[]);

    if (!resolvedChannels.length && fail) {
        return void await handleFailedCommand(
            message.channel, `I couldn't find any channel with the name or ID **${arg}**.`
        );
    }

    else if (resolvedChannels.length === 1){
        return resolvedChannels[0];
    }
    console.log(resolvedChannels.map(c => c instanceof TextChannel ? c.name : ''));
    let out = await conflictOnChannelResolveEmbed(resolvedChannels, arg);

    return resolveNumberedUncertainty(message, out, resolvedChannels, 30000, 'channel');
}
