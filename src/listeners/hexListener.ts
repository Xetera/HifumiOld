import {Message} from "discord.js";
import {hexRegex} from "./Regex";
import Color from "../API/color";
import safeSendMessage from "../handlers/safe/SafeSendMessage";

export default async function hexListener(message: Message){
    const match = message.content.match(hexRegex);
    //match.index
    if (!match)
        return;
    //Color.getColor(match.)
    const hex = match[2];
    const embed = await Color.getColor(hex);
    if (embed)
        safeSendMessage(message.channel, embed);
}
