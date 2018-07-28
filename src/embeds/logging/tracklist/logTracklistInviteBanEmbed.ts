import { RichEmbed, User} from "discord.js";

export default function logTracklistInviteBanEmbed(user: User): RichEmbed{
    return new RichEmbed()
        .setTitle(`Tracked User Banned ⛔`)
        .setThumbnail(user.avatarURL)
        .setDescription(user)
        .setColor('#ff0000')
        .addField(`Global?`, 'No') // will be introducing global bans later
        .addField(`Reason`, 'Sending an invite as a tracked user')
        .setTimestamp()
}
