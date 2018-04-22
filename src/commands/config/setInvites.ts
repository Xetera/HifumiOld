import {Message} from "discord.js";
import gb from "../../misc/Globals";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {getOnOff} from "../../utility/Util";
import {Guild} from "../../database/models/guild";
import disableInvitesEmbed from "../../embeds/commands/configEmbed/disableInvitesEmbed";
import enableInvitesEmbed from "../../embeds/commands/configEmbed/enableInvitesEmbed";
import alreadyDisabledInvitesEmbed from "../../embeds/commands/configEmbed/alreadyDisabledinvitesEmbed";
import alreadyEnabledInvitesEmbed from "../../embeds/commands/configEmbed/alreadyEnabledInvitesEmbed";

export default async function setInvites(message: Message, args: string[]){
    if (!args.length){
        return void await handleInvalidParameters(message.channel, 'invitefilter');
    }
    //invitefilter off -> allows_invites = on;
    const input = args.shift()!;
    const inputAllowed = !getOnOff(input);
    // state -> allow invites = true
    if (inputAllowed === undefined)
        return void await handleInvalidParameters(message.channel, 'invitefilter');
    const allowed  = await gb.instance.database.getAllowGuildInvites(message.guild.id);

    if (!allowed && !inputAllowed){
        return void message.channel.send(await alreadyDisabledInvitesEmbed(message.guild))
    }

    else if (allowed && inputAllowed){
        return void message.channel.send(await alreadyEnabledInvitesEmbed(message.guild))
    }

    gb.instance.database.setAllowGuildInvites(message.guild.id, inputAllowed).then(async (response: Partial<Guild>)=> {
        message.channel.send(!response.allows_invites ? await disableInvitesEmbed(message.guild) : await enableInvitesEmbed(message.guild))
    })
}
