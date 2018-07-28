import {Message} from "discord.js";
import {Guild} from "../../database/models/guild";
import disableInvitesEmbed from "../../embeds/commands/configEmbed/disableInvitesEmbed";
import enableInvitesEmbed from "../../embeds/commands/configEmbed/enableInvitesEmbed";
import alreadyDisabledInvitesEmbed from "../../embeds/commands/configEmbed/alreadyDisabledinvitesEmbed";
import alreadyEnabledInvitesEmbed from "../../embeds/commands/configEmbed/alreadyEnabledInvitesEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

// used by other functions as well

export default async function setInvites(message: Message, input: [boolean]){
    const [filterStatus] = input;
    const inputAllowInvites = !filterStatus;

    const database: IDatabase = Container.get(IDatabase);
    const allowed  = await database.getGuildColumn(message.guild.id, 'allows_invites');

    if (!allowed && !inputAllowInvites){
        return void safeSendMessage(message.channel, await alreadyDisabledInvitesEmbed(message.guild))
    }

    else if (allowed && inputAllowInvites){
        return void safeSendMessage(message.channel, await alreadyEnabledInvitesEmbed(message.guild))
    }

    const response: Partial<Guild> = await database.setGuildColumn(message.guild.id, 'allows_invites', inputAllowInvites);
    const embed = !response.allows_invites ? await disableInvitesEmbed(message.guild) : await enableInvitesEmbed(message.guild);
    safeSendMessage(message.channel, embed);
}


