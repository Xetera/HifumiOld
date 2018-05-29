import {Message} from "discord.js";
import gb from "../../misc/Globals";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {getOnOff} from "../../utility/Util";
import {Guild} from "../../database/models/guild";
import disableInvitesEmbed from "../../embeds/commands/configEmbed/disableInvitesEmbed";
import enableInvitesEmbed from "../../embeds/commands/configEmbed/enableInvitesEmbed";
import alreadyDisabledInvitesEmbed from "../../embeds/commands/configEmbed/alreadyDisabledinvitesEmbed";
import alreadyEnabledInvitesEmbed from "../../embeds/commands/configEmbed/alreadyEnabledInvitesEmbed";

export default async function setInvites(message: Message, input: [boolean]){
    const [filterStatus] = input;
    const inputAllowInvites = !filterStatus;
    const allowed  = await gb.instance.database.getAllowGuildInvites(message.guild.id);

    if (!allowed && !inputAllowInvites){
        return void message.channel.send(await alreadyDisabledInvitesEmbed(message.guild))
    }

    else if (allowed && inputAllowInvites){
        return void message.channel.send(await alreadyEnabledInvitesEmbed(message.guild))
    }

    gb.instance.database.setAllowGuildInvites(message.guild.id, inputAllowInvites).then(async (response: Partial<Guild>)=> {
        message.channel.send(!response.allows_invites ? await disableInvitesEmbed(message.guild) : await enableInvitesEmbed(message.guild))
    });
}
