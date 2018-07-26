import {GuildMember, RichEmbed} from "discord.js";
import {getMuteTime} from "../../utility/Settings";
import {formattedTimeString} from "../../utility/Util";
import {Offense} from "../../moderation/interfaces";

export default function logMutedEmbed(member: GuildMember, mutedBy: GuildMember, reason: string | Offense, duration: number): RichEmbed {
    return new RichEmbed()
        .setThumbnail(member.user.avatarURL)
        .setColor('#ffa739')
        .setTitle(`Muted 🔇`)
        .addField(`User `, member, true)
        .addField(`Muted By`, mutedBy, true)
        .addField(`Duration`, formattedTimeString(duration ? duration : getMuteTime()), true)
        .addField(`Reason`, reason, true)
        .setTimestamp();
}
