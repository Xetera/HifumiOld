import {GuildMember, RichEmbed} from "discord.js";

export default function pfpEmbed(member: GuildMember, found: boolean = true){
    return new RichEmbed()
        .setDescription(`[Link to the picture](${member.user.avatarURL})`)
        .setImage(member.user.avatarURL)
        .setColor(member.highestRole.color)
}
