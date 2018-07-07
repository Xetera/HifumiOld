import {RichEmbed} from "discord.js";

export default function prefixReminderEmbed(prefix: string){
    return new RichEmbed()
        .setTitle(`Hi!`)
        .setColor('BLUE')
        .setDescription(`**My prefix here is: **${prefix}\n**${prefix}help** for more info!`)
}
