import safeMessageUser from "./SafeMessageUser";
import {DiscordAPIError, GuildMember, RichEmbed} from "discord.js";
import {debug} from "../../actions/Actions";
import {APIErrors} from "../../interfaces/Errors";
import {log} from "../../utility/Logging";
import {getOnBanMessageSnipeCount} from "../../utility/Settings";
import {LogManager} from "../logging/logManager";
import gb from "../../misc/Globals";

export default async function safeBanUser(member : GuildMember, reason: string, banMessage?: string|RichEmbed) : Promise<void>{
    const memberName : string = member.nickname||member.user.username;
    if (!member.bannable || !member.guild.me.hasPermission("BAN_MEMBERS")){
        debug.warning(
            `Could not ban ${memberName} from ` +
            `${member.guild.name}, missing ban permissions.`
        );
        return Promise.reject(`Couldn't ban ${member.user.username} from ${member.guild.name}, missing ban permissions.`);
    }

    const banOptions = {
        days: getOnBanMessageSnipeCount(),
        reason: reason
    };
    if (banMessage){
        await safeMessageUser(member, banMessage)
    }
    return member.ban(banOptions).then((banned : GuildMember)=> {
        debug.info(`Banned member ${memberName} from ${banned.guild.name}.`);
        gb.instance.database.incrementBanCount(banned.guild.id);
        // we're already logging all bans
        // LogManager.logBan(member.guild, member.user);
    }).catch((err : DiscordAPIError) => {
        if (err.message === APIErrors.MISSING_PERMISSIONS){
            debug.warning(
                `Could not ban ${memberName} from ` +
                `${member.guild.name}, missing permissions.`
            );
        }
        debug.warning(`Error while banning user ${member.user.username}`);
        return Promise.reject(err);
    })
}
