import {GuildMember, RichEmbed, User} from "discord.js";

export default function logTracklistSpamBanEmbed(user: User): RichEmbed{
    return new RichEmbed()
        .setTitle(`Tracked User Banned ⛔`)
        .setThumbnail(user.avatarURL)
        .setDescription(user)
        .setColor('#ff0000')
        .addField(`Global?`, 'No') // will be introducing global bans later
        .addField(`Reason`, 'Spamming as a tracked user')
        .setTimestamp()
}