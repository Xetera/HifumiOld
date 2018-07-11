import {Message} from "discord.js";
import gb from "../../misc/Globals";
import {Guild} from "../../database/models/guild";
import disableInvitesEmbed from "../../embeds/commands/configEmbed/disableInvitesEmbed";
import enableInvitesEmbed from "../../embeds/commands/configEmbed/enableInvitesEmbed";
import alreadyDisabledInvitesEmbed from "../../embeds/commands/configEmbed/alreadyDisabledinvitesEmbed";
import alreadyEnabledInvitesEmbed from "../../embeds/commands/configEmbed/alreadyEnabledInvitesEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

// used by other functions as well

export default async function setInvites(message: Message, input: [boolean]){
    const [filterStatus] = input;
    const inputAllowInvites = !filterStatus;
    const allowed  = await gb.instance.database.getAllowGuildInvites(message.guild.id);

    if (!allowed && !inputAllowInvites){
        return void safeSendMessage(message.channel, await alreadyDisabledInvitesEmbed(message.guild))
    }

    else if (allowed && inputAllowInvites){
        return void safeSendMessage(message.channel, await alreadyEnabledInvitesEmbed(message.guild))
    }

    gb.instance.database.setAllowGuildInvites(message.guild.id, inputAllowInvites).then(async (response: Partial<Guild>)=> {
        safeSendMessage(message.channel, !response.allows_invites ? await disableInvitesEmbed(message.guild) : await enableInvitesEmbed(message.guild))
    });
}


