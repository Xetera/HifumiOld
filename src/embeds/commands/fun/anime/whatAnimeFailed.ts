import {RichEmbed} from "discord.js";
import {warningEmbedColor} from "../../../../utility/Settings";

export default function whatAnimeFailedEmbed(){
    return new RichEmbed()
        .setTitle("Not a valid image")
        .setColor(warningEmbedColor)
}
