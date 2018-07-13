import {GuildMember, RichEmbed} from "discord.js";

export default function pfpEmbed(member: GuildMember, found: boolean = true){
    return new RichEmbed()
        .setTitle(`${member.user.username}'s profile picture`)
        .setDescription(`[Image URL](${member.user.avatarURL})\n[Reverse search results](https://www.google.com/searchbyimage?&image_url=${member.user.displayAvatarURL})`)
        .setImage(member.user.displayAvatarURL)
        .setColor(member.highestRole.color)
}
