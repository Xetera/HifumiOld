import safeMessageUser from "./SafeMessageUser";
import {DiscordAPIError, GuildMember} from "discord.js";
import {debug} from "../../actions/Actions";
import {APIErrors} from "../../interfaces/Errors";
import {log} from "../../utility/Logging";
import {getOnBanMessageSnipeCount} from "../../utility/Settings";

export default function safeBanUser(member : GuildMember, reason : string, banMessage : string, logMessage ?: string){
    const memberName : string = member.nickname||member.user.username;

    if (!member.guild.members.find('id', member.client.user.id).hasPermission("BAN_MEMBERS")){
        return debug.warning(
            `Could not ban ${memberName} from ` +
            `${member.guild.name} for invite spamming, missing ban permissions.`
        );
    }

    const banOptions = {
        days: getOnBanMessageSnipeCount(),
        reason: reason
    };

    safeMessageUser(member.user, banMessage).then(()=> {
        return member.ban(banOptions)
    }).then((banned : GuildMember)=> {
        debug.info(`Banned member ${memberName} from ${banned.guild.name} for invite spam.`);
        if (logMessage)
            log(member.guild, logMessage);
    }).catch((err : DiscordAPIError) => {
        if (err.message === APIErrors.MISSING_PERMISSIONS){
            debug.warning(
                `Could not ban ${memberName} from ` +
                `${member.guild.name}, missing permissions.`
            );
        }
        debug.warning(`Error while banning `)
    })
}