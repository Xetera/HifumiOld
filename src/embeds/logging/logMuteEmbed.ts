import {GuildMember, RichEmbed, TextChannel} from "discord.js";
import {getMuteTime} from "../../utility/Settings";
import {formattedTimeString, formatTime} from "../../utility/Util";
import {Offense} from "../../moderation/interfaces";

export default function logMutedEmbed(member: GuildMember, mutedBy: GuildMember, reason: string | Offense, duration: number): RichEmbed {
    return new RichEmbed()
        .setTitle(`User Muted 🔇`)
        .setThumbnail(member.user.avatarURL)
        .setDescription(member)
        .setColor('#ffa739')
        .addField(`Muted By`, mutedBy)
        .addField(`Reason`, reason, true)
        .addField(`Duration`, formattedTimeString(duration ? duration : getMuteTime()), true)
        .setTimestamp();
}
