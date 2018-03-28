import safeBanUser from "../../../handlers/safe/SafeBanUser";
import {GuildMember} from "discord.js";
import {advertiseOnRaidBan} from "../../../interfaces/Replies";

/**
 * Tracked user is a member that has joined in the past 5 minutes
 * */
export default function banTrackedUserForSpam(member : GuildMember){
    const reason = 'Spamming as a fresh member';

    safeBanUser(member, reason,
        `You were banned from ${member.guild.name} for spamming recently after joining.\n${advertiseOnRaidBan()}`,
        `Banned tracked user @${member.displayName} for spamming`);

}