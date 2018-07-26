import {
    Channel,
    Message,
    MessageMentions,
    TextChannel,
    VoiceChannel
} from "discord.js";
import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
import conflictOnChannelResolveEmbed from "../embeds/resolvers/conflictOnChannelResolveEmbed";
import resolveNumberedUncertainty from "./resolveNumberedUncertainty";
import {AllChannelTypes} from "../interfaces/arg.interface";

export async function channelResolver(arg: string, message: Message, options: {channelType: AllChannelTypes, onlyMention?: boolean, fail?: boolean, strict?: boolean}/*channelType: AllChannelTypes, onlyMention: boolean = false, fail: boolean = true*/): Promise<Channel | undefined> {
    // Can't set default values for objects
    if (options.fail === undefined)
        options.fail = true;

    if (options.strict === undefined)
        options.strict = true;

    if (options.channelType !== 'BOTH'
        && message.mentions.channels.size
        && message.mentions.channels.first().type !== options.channelType){
        return void handleFailedCommand(
            message.channel, `That is not a valid channel type`
        );
    }
    else if (message.mentions.channels.size || arg.match(MessageMentions.CHANNELS_PATTERN)) {
        return message.mentions.channels.first();
    }
    else if (options.onlyMention && options.fail){
        return void handleFailedCommand(
            message.channel, `This command requires a channel mention.`
        )
    }

    // probably not a channel name if there is a member mentioned
    else if (options.onlyMention){
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

    if (!resolvedChannels.length && options.fail) {
        return void await handleFailedCommand(
            message.channel, `I couldn't find any channel with the name or ID **${arg}**.`
        );
    }

    else if (resolvedChannels.length === 1){
        return resolvedChannels[0];
    }
    else if (!options.strict){
        return resolvedChannels[0]
    }

    let out = await conflictOnChannelResolveEmbed(resolvedChannels, arg);

    return resolveNumberedUncertainty(message, out, resolvedChannels, 30000, 'channel');
}
