import {Channel, GuildMember, RichEmbed, TextChannel} from "discord.js";
import {getMuteTime} from "../../utility/Settings";
import {formattedTimeString, formatTime} from "../../utility/Util";
import {Offense} from "../../moderation/interfaces";

export default function logMemberLeaveEmbed(member: GuildMember): RichEmbed {
    return new RichEmbed()
        .setAuthor(`User Left`, member.user.avatarURL)
        .setDescription(member)
        .setColor('#ff581f')
        .setTimestamp()
}