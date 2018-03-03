import safeBanUser from "../handlers/SafeBanUser";
import {GuildMember} from "discord.js";

export default function banTrackedUserForInvite(member : GuildMember){
    const reason = 'Sending invites as a fresh member';

    safeBanUser(member, reason,
        `You were banned from ${member.guild.name} for posting an invite too recently after joining.`,
        `Banned tracked user @${member.displayName} for sending an invite`)
}