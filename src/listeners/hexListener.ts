import {Message} from "discord.js";
import {hexRegex, specialCharRegex} from "./Regex";
import Color from "../API/color";
import safeSendMessage from "../handlers/safe/SafeSendMessage";
import {gb} from "../misc/Globals";

const exclusions = [
    'embed',
    'editembed',
    'ee'
];
export default async function hexListener(message: Message){
    const match = message.content.match(hexRegex);
    if (!match)
        return;
    const hex = match[2];
    const prefix = await gb.database.getPrefix(message.guild.id);

    /**
     * idk if this might be a problem in the future
     * in case we get some sort of command for this
     */
    if (specialCharRegex.test(message.content[0]) && message.content[0] !== '#'){
        return;
    }

    for (const command of exclusions){
        if (message.content.startsWith(prefix + command)){
            return;
        }
    }

    const embed = await Color.getColor(hex);
    if (embed)
        safeSendMessage(message.channel, embed);
}
