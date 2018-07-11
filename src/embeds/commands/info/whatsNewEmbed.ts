import {RichEmbed} from "discord.js";

export default function whatsNewEmbed(version: string, notes: string){
    return new RichEmbed()
        .setTitle(`What's New?`)
        .setDescription(notes)
        .setColor('#abffe4')
        .setFooter(`Version ${version}`)
}
