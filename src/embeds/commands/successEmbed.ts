import {GuildMember, RichEmbed} from "discord.js";

export default function successEmbed(member: GuildMember, message: string){
    return new RichEmbed()
        .setAuthor(`Success!`, member.user.avatarURL)
        .setDescription(message)
        .setColor(`#98ffa3`)
}
