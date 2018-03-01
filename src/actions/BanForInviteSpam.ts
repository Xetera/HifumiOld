import {DiscordAPIError, Guild, GuildMember, Permissions} from "discord.js";
import {getOnBanMessageSnipeCount} from "../utility/Settings";
import {debug} from './Actions'
import {APIErrors} from "../interfaces/Errors";
import {log} from "../utility/Logging";
import safeMessageUser from "../handlers/SafeMessageUser";


export default function banForInviteSpam(member : GuildMember){
    const reason : string = `Banned for spamming invites.`;
    const memberName : string = member.nickname||member.user.username;

    // this can get a little awkward to send messages before banning so we're checking if
    // we have the ban members permission
    if (!member.guild.members.find('id', member.client.user.id).hasPermission("BAN_MEMBERS")){
        return debug.warning(
            `Could not ban ${memberName} from ` +
            `${member.guild.name} for invite spamming, missing ban permissions.`
        );
    }

    safeMessageUser(
        member.user,
        `You were banned from ${member.guild.name} for posting 5 invites, advertising is not allowed, sorry.`)
        .then(()=> {
        return member.ban({
            days: getOnBanMessageSnipeCount(),
            reason: reason
        })
    }).then((banned : GuildMember)=> {
        debug.info(`Banned member ${memberName} from ${banned.guild.name} for invite spam.`);
        log(member.guild, `Banned @${memberName} for spamming invites.`);
    }).catch((err : DiscordAPIError) => {
        if (err.message === APIErrors.MISSING_PERMISSIONS){
            debug.warning(
                `Could not ban ${memberName} from ` +
                `${member.guild.name} for invite spamming, missing permissions.`
            );
        }
    })

}