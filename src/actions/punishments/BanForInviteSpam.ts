import {DiscordAPIError, Guild, GuildMember, Permissions} from "discord.js";
import safeBanUser from "../../handlers/safe/SafeBanUser";
import {advertiseOnRaidBan} from "../../interfaces/Replies";


export default function banForInviteSpam(member : GuildMember){
    const reason : string = `Banned for spamming invites.`;

    safeBanUser(member, reason,
        `🚫 You were banned from ${member.guild.name} for posting 5 invites, advertising is not allowed, sorry.\n${advertiseOnRaidBan()}`,
        `Banned ${member} for spamming invites.`);

}