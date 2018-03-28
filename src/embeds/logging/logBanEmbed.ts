import {GuildMember, RichEmbed, User} from "discord.js";
import {Offense} from "../../moderation/interfaces";

export default function logBanEmbed(user: User, reason: string | Offense, soft?: boolean): RichEmbed{
    return new RichEmbed()
        .setTitle(`User Banned ⛔`)
        .setThumbnail(user.avatarURL)
        .setDescription(user)
        .setColor('#ff0000')
        .addField(`Reason`, reason ? reason : 'No reason given')
        .setTimestamp()
}