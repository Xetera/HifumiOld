import {GuildMember, RichEmbed, User} from "discord.js";
import {Offense} from "../../moderation/interfaces";

export default function logBanEmbed(user: User, reason: string | Offense, bannedBy: User): RichEmbed{
    return new RichEmbed()
        .setTitle(`⛔ User Banned [${user.username}#${user.discriminator}]`)
        .setThumbnail(user.avatarURL)
        .setDescription(user)
        .setColor('#ff0000')
        .addField(`Reason`, reason ? reason : 'No reason given')
        .addField(`Banned By`, bannedBy)
        .setTimestamp()
}
