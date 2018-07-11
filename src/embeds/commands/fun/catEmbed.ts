import {RichEmbed} from "discord.js";

export default function catEmbed(url: string){
    return new RichEmbed()
        .setTitle(`Kitty!`)
        .setImage(url)
        .setColor('RANDOM')
}
