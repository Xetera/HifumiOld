import {RichEmbed} from "discord.js";
import gb from "../../../misc/Globals";

export default function doggoEmbed(url: string){
    const sections = url.split('/');
    const breed = sections[sections.length - 2];
    return new RichEmbed()
        .setTitle(`${gb.emojis.get('dog_face_no_space')} | Breed: ${breed}`)
        .setImage(url)
        .setColor('RANDOM')
}
