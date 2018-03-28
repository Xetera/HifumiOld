import {Channel, GuildMember, RichEmbed, TextChannel} from "discord.js";
import {getMuteTime} from "../../utility/Settings";
import {formattedTimeString, formatTime} from "../../utility/Util";
import {Offense} from "../../moderation/interfaces";

export default function logMutedEmbed(member: GuildMember): RichEmbed {
    return new RichEmbed()
        .setTitle(`User Muted 🔇`)
        .setThumbnail(member.user.avatarURL)
        .setDescription(member)
        .setColor('#ffa739')
        .addField(`Reason`, `Spamming`, true)
        .addField(`Duration`, formattedTimeString(getMuteTime()), true)
        .setTimestamp();
}