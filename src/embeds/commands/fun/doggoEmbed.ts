import {RichEmbed} from "discord.js";

export default function doggoEmbed(url: string){
    const sections = url.split('/');
    const breed = sections[sections.length - 2];
    return new RichEmbed()
        .setTitle(`Breed: ${breed}`)
        .setImage(url)
        .setColor('RANDOM')
}
