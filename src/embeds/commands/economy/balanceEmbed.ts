import {GuildMember, RichEmbed} from "discord.js";
import gb from "../../../misc/Globals";
import EconomyHandler from "../../../handlers/economy/economyHandler";

export default function balanceEmbed(member: GuildMember, format: string, streak: number){
    if (member === member.guild.me){
        return new RichEmbed()
            .setTitle(`My balance`)
            .setColor(`#729eff`)
            .setDescription(`Bank of Hifumi has a treasury of:\n${EconomyHandler.formatMoney(798319146392, true)}\n`)
            .setThumbnail(member.guild.me.user.avatarURL)
    }
    return new RichEmbed()
        .setTitle(`${member.user.username}'s Balance`)
        .setDescription(
            `${member.user.username} has a balance of:\n${format}\n` +
            `They are ${streak ? `on a **${streak} day**` : '**not** on a'} daily streak`)
        .setColor(`#729eff`)
        .setThumbnail(member.user.avatarURL)
}
