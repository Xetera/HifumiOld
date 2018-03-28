import {DiscordAPIError, Guild, GuildMember, Permissions} from "discord.js";
import safeBanUser from "../../handlers/safe/SafeBanUser";
import inviteSpamBanEmbed from "../../embeds/moderation/inviteSpamBanEmbed";


export default function banForInviteSpam(member : GuildMember){
    const reason : string = `Banned for spamming invites.`;

    safeBanUser(member, reason,
        inviteSpamBanEmbed(member.guild),
        `Banned ${member} for spamming invites.`);

}