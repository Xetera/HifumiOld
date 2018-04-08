import {DiscordAPIError, Guild, GuildMember, Permissions} from "discord.js";
import safeBanUser from "../../handlers/safe/SafeBanUser";
import inviteSpamBanEmbed from "../../embeds/moderation/inviteSpamBanDMEmbed";
import {LogManager} from "../../handlers/logging/logManager";


export default function banForInviteSpam(member : GuildMember){
    const reason : string = `Spamming invites as a fresh member <TRACKED>`;

    safeBanUser(member, reason, inviteSpamBanEmbed(member.guild));
    LogManager.logBan(member.guild, member.user);
}