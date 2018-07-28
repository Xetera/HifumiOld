import {Message, RichEmbed} from "discord.js";
import {gb} from "../../../misc/Globals";

export default function botInfoEmbed(message: Message){
    const commandCount = gb.commandHandler.commands.length;
    const serverCount = message.client.guilds.size;
    const userCount = message.client.users.size;
    return new RichEmbed()
        .setAuthor(`Hifumi by Xetera#9596`, 'https://cdn.discordapp.com/avatars/140862798832861184/a_21b1a2d492ac27ec78e82dff7a8dd4c5.gif')
        .setThumbnail(message.guild.me.user.avatarURL)
        .setColor('#ffd275')
        .addField(`Version`, `2.0.0`,true)
        .addField(`Language`, `Typescript`, true)
        .addField(`Database`, `Postgres`, true)
        .addField(`Commands`, commandCount, true)
        .addField(`Total Servers`, serverCount, true)
        .addField(`Total Users`, userCount, true)
        .setTimestamp()
}
