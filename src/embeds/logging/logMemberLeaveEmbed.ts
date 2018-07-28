import { GuildMember, RichEmbed} from "discord.js";

export default function logMemberLeaveEmbed(member: GuildMember): RichEmbed {
    return new RichEmbed()
        .setAuthor(`User Left`, member.user.avatarURL)
        .setDescription(member + `\n${member.user.username}#${member.user.discriminator}`)
        .setColor('#ff581f')
        .setTimestamp()
}
