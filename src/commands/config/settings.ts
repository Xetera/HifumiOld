import {Message} from "discord.js";
import {Database} from "../../database/Database";

import {debug} from '../../utility/Logging'
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import gb from "../../misc/Globals";
import {Guild} from "../../database/models/guild";
import getSettingsEmbed from "../../embeds/commands/configEmbed/getConfig";
import setPrefix from "./SetPrefix";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import setHints from "../self/hints";
import {getOnOff} from "../../utility/Util";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import onlyAdmin from "../../decorators/onlyAdmin";
import missingAdminEmbed from "../../embeds/permissions/missingAdminEmbed";
import setStrikeLimit from "../moderation/setStrikeLimit";
import reactions from "./reactions";
import setNewMemberTracking from "../moderation/setNewMemberTracking";
import setInvites from "./setInvites";
import setInviteWarn from "./setInviteWarn";
import setInviteBan from "./setInviteBan";

export default async function settings(message : Message, input: [(string | undefined), (string | undefined)]) {
    const [setting, choice] = input;

    const guild = message.guild;
    const cache: Guild = await gb.instance.database.getGuild(guild.id);

    if (!cache) {
        debug.error(`Guild ${guild.name} was not found in cache.`, `getConfig`);
        return void safeSendMessage(message.channel,
            `Uhh... for some reason I wasn't able to cache your server properly...\n` +
            `This should never happen, go bother Xetera#9596 about it.`);
    }

    if (!setting){
        const embed = getSettingsEmbed(guild, cache);
        return void safeSendMessage(message.channel, embed);
    }
    else if (!message.member.hasPermission('ADMINISTRATOR')){
        return void safeSendMessage(message.channel, missingAdminEmbed(message.guild));
    }

    if (setting === 'prefix'){
        if (!choice){
            return void handleInvalidParameters(message.channel, 'settings prefix')
        }
        return void setPrefix(message, [choice])
    }
    else if (setting === 'hints'){
        if (!choice){
            return void handleInvalidParameters(
                message.channel, 'settings hints'
            )
        }
        const bool = getOnOff(choice);
        if (bool === undefined){
            return void handleFailedCommand(
                message.channel, `I was expecting **${choice}** to be 'on' or 'off'`
            );
        }
        return void setHints(message, [bool])
    }
    else if (setting === 'premium'){
        return void safeSendMessage(message.channel, '😂');
    }
    else if (setting === 'strikelimit'){
        if (!choice){
            return void handleInvalidParameters(
                message.channel, 'settings strikelimit'
            )
        }

        const num = Number(choice);
        if (!Number.isInteger(num)){
            return void handleFailedCommand(
                message.channel, `**${choice}** is not a number.`
            )
        }

        return void setStrikeLimit(message, [num]);
    }
    else if (setting === 'reactions'){
        if (!choice){
            return void handleInvalidParameters(
                message.channel, 'settings reactions'
            )
        }
        const bool = getOnOff(choice);
        if (bool === undefined){
            return void handleFailedCommand(
                message.channel, `I was expecting **${choice}** to be 'on' or 'off'`
            )
        }
        return void reactions(message, [bool]);
    }
    else if (setting === 'tracking'){
        if (!choice){
            return void handleInvalidParameters(
                message.channel, 'settings tracking'
            )
        }
        const bool = getOnOff(choice);
        if (bool === undefined){
            return void handleFailedCommand(
                message.channel, `I was expecting **${choice}** to be 'on' or 'off'`
            )
        }

        return void setNewMemberTracking(message, [bool]);
    }
    else if (setting === 'invites'){
        if (!choice){
            return void handleInvalidParameters(
                message.channel, 'settings tracking'
            )
        }
        const bool = !getOnOff(choice);
        if (bool === undefined){
            return void handleFailedCommand(
                message.channel, `I was expecting **${choice}** to be 'on' or 'off'`
            )
        }

        return void setInvites(message, [bool]);
    }
    else if (setting === 'invitewarn'){
        if (!choice){
            return void handleInvalidParameters(
                message.channel, 'settings invitewarn'
            )
        }
        const num = Number(choice);
        if (!Number.isInteger(num)){
            return void handleFailedCommand(
                message.channel, `**${choice}** is not a number.`
            )
        }

        return void setInviteWarn(message, [num]);
    }
    else if (setting === 'inviteban'){
        if (!choice){
            return void handleInvalidParameters(
                message.channel, 'settings inviteban'
            )
        }
        const num = Number(choice);
        if (!Number.isInteger(num)){
            return void handleFailedCommand(
                message.channel, `**${choice}** is not a number.`
            )
        }

        return void setInviteBan(message, [num]);
    }
    else {
        return void handleFailedCommand(
            message.channel, `**${setting}** is not a valid setting`
        );
    }
}
