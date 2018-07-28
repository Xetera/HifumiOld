import { GuildMember, RichEmbed} from "discord.js";

export default function logMemberJoinEmbed(member: GuildMember): RichEmbed {
    return new RichEmbed()
        .setAuthor(`User Joined`, member.user.avatarURL)
        .setDescription(member + `\n${member.user.username}#${member.user.discriminator}`)
        .setColor('#3fff3d')
        .setTimestamp()
}
