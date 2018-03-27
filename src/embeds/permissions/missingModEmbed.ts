import {RichEmbed} from "discord.js";
import gb from "../../misc/Globals";

export default function missingModEmbed(): RichEmbed{
    return new RichEmbed()
        .setTitle(`Nice try`)
        .setDescription(`Yeah... not happening unless you're a mod. ${gb.emojis.get('alexa_lul')}`)
        .setColor('#ff0000');
}