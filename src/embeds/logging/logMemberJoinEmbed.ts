import {Channel, GuildMember, RichEmbed, TextChannel} from "discord.js";
import {getMuteTime} from "../../utility/Settings";
import {formattedTimeString, formatTime} from "../../utility/Util";
import {Offense} from "../../moderation/interfaces";

export default function logMemberJoinEmbed(member: GuildMember): RichEmbed {
    return new RichEmbed()
        .setAuthor(`User Joined`, member.user.avatarURL)
        .setDescription(member + `\n${member.user.username}#${member.user.discriminator}`)
        .setColor('#3fff3d')
        .setTimestamp()
}
