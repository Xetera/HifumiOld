import safeBanUser from "../../../handlers/safe/SafeBanUser";
import {GuildMember} from "discord.js";
import {LogManager} from "../../../handlers/logging/logManager";
import {Offense} from "../../../moderation/interfaces";
import watchlistInviteBanDMEmbed from "../../../embeds/moderation/tracklist/tracklistInviteBanDMEmbed";

/**
 * Tracked user is a member that has joined in the past 5 minutes
 * */
export default function banTrackedUserForInvite(member : GuildMember){
    const reason = 'Sending invites as a fresh member <TRACKED>';

    safeBanUser(member, reason, watchlistInviteBanDMEmbed(member.guild));

    LogManager.logTrackedBan(member.guild, member.user, Offense.InviteLink);
}
