import {Guild, RichEmbed} from "discord.js";
import {warningEmbedColor} from "../../utility/Settings";

export default function infractionDMEmbed(guild: Guild, weight: number, reason: string, currentStrikes: number, strikeCap: number){
    return new RichEmbed()
        .setTitle(`Moderator Warning!`)
        // TODO: add personalized warning messages
        .setDescription(
            `You've been warned by a moderator in **${guild.name}**`)
        .setColor(warningEmbedColor)
        .addField(`__Weight__`, weight, true)
        .addField(`__Current Strikes__`, `${currentStrikes}/${strikeCap}`, true)
        .addField(`__Reason__`, reason);
    // TODO: add $appeal
}
