import resolveNumberedUncertainty from "./resolveNumberedUncertainty";
import conflictOnChannelResolveEmbed from "../embeds/resolvers/conflictOnChannelResolveEmbed";
import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
import {DMChannel, Message, MessageMentions, Role, TextChannel, VoiceChannel} from "discord.js";
import {AllChannelTypes} from "../decorators/expects";
import conflictOnRoleResolveEmbed from "../embeds/resolvers/conflictOnRoleResolveEmbed";

export default async function roleResolver(message: Message, arg: string) {

    if (message.mentions.roles.size || arg.match(MessageMentions.ROLES_PATTERN)) {
        return message.mentions.roles.array().shift();
    }
    const resolvedRole = message.guild.roles.get(arg);
    if (resolvedRole){
        return resolvedRole;
    }

    const resolvedChannels: Role[] =  message.guild.roles.array().reduce((arr: Role[], c: Role) => {
        if (c.name.toLowerCase().includes(arg.toLowerCase()) || c.id === arg){
            arr.push(c);
        }
        return arr;
    }, <Role[]>[]);

    if (!resolvedChannels.length) {
        return void await handleFailedCommand(
            message.channel, `I couldn't find any roles with the name or ID **${arg}**.`
        );
    }

    else if (resolvedChannels.length === 1){
        return resolvedChannels[0];
    }
    let out = await conflictOnRoleResolveEmbed(resolvedChannels, arg);

    return resolveNumberedUncertainty(message, out, resolvedChannels, 30000, 'channel');
}
