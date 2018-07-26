import { GuildMember} from "discord.js";
import safeBanUser from "../../handlers/safe/SafeBanUser";
import inviteSpamBanEmbed from "../../embeds/moderation/inviteSpamBanDMEmbed";


export default async function banForInviteSpam(member : GuildMember){
    const reason : string = `Spamming invites as a fresh member <TRACKED>`;
    safeBanUser(member, reason, await inviteSpamBanEmbed(member.guild));
}
