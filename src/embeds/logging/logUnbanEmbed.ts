import {GuildMember, RichEmbed, User} from "discord.js";
import {Offense} from "../../moderation/interfaces";

export default function logUnbanEmbed(user: User, invoker: User, reason: string): RichEmbed{
    return new RichEmbed()
        .setTitle(`User Unbanned 😇`)
        .setThumbnail(user.avatarURL)
        .setDescription(user)
        .setColor('#458cff')
        .addField(`Original Ban Reason`, reason ? reason : 'No reason given')
        .addField(`Responsible Staff`, invoker)
        .setTimestamp();
        // this will only become relevant when we introduce soft bans
}