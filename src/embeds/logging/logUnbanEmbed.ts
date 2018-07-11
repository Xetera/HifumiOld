import {GuildMember, RichEmbed, User} from "discord.js";
import {Offense} from "../../moderation/interfaces";

export default function logUnbanEmbed(user: User, unbanningStaff: User, banningStaff: User | 'unknown',
                                      banReason: string | 'unknown', unbanReason: string): RichEmbed{
    return new RichEmbed()
        .setTitle(`😇 User Unbanned [${user.username}#${user.discriminator}]`)
        .setThumbnail(user.avatarURL)
        .setDescription(user)
        .setColor('#458cff')
        .addField(`Original Ban Reason`, banReason ? banReason : 'No reason given')
        .addField(`Unban Reason`, unbanReason  ? unbanReason : 'No reason given')
        .addField(`Banned By`, banningStaff, true)
        .addField(`Unbanned By`, unbanningStaff, true)
        .setTimestamp();
        // this will only become relevant when we introduce soft bans
}
