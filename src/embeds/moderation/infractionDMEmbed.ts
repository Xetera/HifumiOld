import {Guild, RichEmbed} from "discord.js";
import {warningEmbedColor} from "../../utility/Settings";

export default function infractionDMEmbed(guild: Guild, weight: number, reason: string, currentStrikes: number, strikeCap: number){
    return new RichEmbed()
        .setTitle(`Infracted!`)
        // TODO: add personalized warning messages
        .setDescription(`You've been warned by a moderator in **${guild.name}** with weight **${weight}**`)
        .setColor(warningEmbedColor)
        .addField(`__Current Strikes__`, `${currentStrikes}/${strikeCap}`)
        .addField(`__Reason__`, reason);
    // TODO: add $appeal
}
