import {Guild, RichEmbed} from "discord.js";
import {advertiseOnBan} from "../../../interfaces/Replies";

export default function tracklistInviteBanDMEmbed(guild: Guild): RichEmbed{
    return new RichEmbed()
        .setTitle(`Banned ⛔`)
        .setColor('#FF0000')
        .setDescription(
            `You were banned in \`${guild.name}\` for posting an invite as a tracked member.`+
            `\n\n${advertiseOnBan()}`)
        .setImage('https://github.com/ilocereal/Alexa/blob/master/alexanoinvite.png?raw=true')
        .setTimestamp()
}