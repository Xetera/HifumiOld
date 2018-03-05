import {DiscordAPIError, Guild, GuildMember, Permissions} from "discord.js";
import {getOnBanMessageSnipeCount} from "../utility/Settings";
import {debug} from './Actions'
import {APIErrors} from "../interfaces/Errors";
import {log} from "../utility/Logging";
import safeMessageUser from "../handlers/safe/SafeMessageUser";
import safeBanUser from "../handlers/safe/SafeBanUser";


export default function banForInviteSpam(member : GuildMember){
    const reason : string = `Banned for spamming invites.`;

    // this can get a little awkward to send     messages before banning so we're checking if
    // we have the ban members permission
    safeBanUser(member, reason,
        `You were banned from ${member.guild.name} for posting 5 invites, advertising is not allowed, sorry.`,
        `Banned @${member.displayName} for spamming invites.`)

}