import safeBanUser from "../../../handlers/safe/SafeBanUser";
import {GuildMember} from "discord.js";
import {LogManager} from "../../../handlers/logging/logManager";
import {Offense} from "../../../moderation/interfaces";
import watchlistSpamBanDMEmbed from "../../../embeds/moderation/tracklist/tracklistSpamBanDMEmbed";

/**
 * Tracked user is a member that has joined in the past 5 minutes
 * */
export default function banTrackedUserForSpam(member : GuildMember){
    const reason = 'Spamming as a tracked user <TRACKED>';

    safeBanUser(member, reason, watchlistSpamBanDMEmbed(member.guild));

    LogManager.logTrackedBan(member.guild, member.user, Offense.Spam);
}
