import {GuildMember, RichEmbed, User} from "discord.js";
import {Offense} from "../../moderation/interfaces";

export default function logUnbanEmbed(user: User, unbanningStaff: User, banningStaff: User | 'unknown', reason: string): RichEmbed{
    return new RichEmbed()
        .setTitle(`User Unbanned 😇`)
        .setThumbnail(user.avatarURL)
        .setDescription(user)
        .setColor('#458cff')
        .addField(`Original Ban Reason`, reason ? reason : 'No reason given')
        .addField(`Banned By`, banningStaff, true)
        .addField(`Unbanned By`, unbanningStaff, true)
        .setTimestamp();
        // this will only become relevant when we introduce soft bans
}
