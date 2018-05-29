import {RichEmbed} from "discord.js";

export default function chEmbed(number: number | string, img: string){
    return new RichEmbed()
        .setTitle(`Cyanide and Happiness Comic #${number}`)
        .setImage(img)
        .setColor('#aae5ff')
}
