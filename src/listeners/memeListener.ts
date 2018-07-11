import {Message} from "discord.js";
import safeSendMessage from "../handlers/safe/SafeSendMessage";

export default function memeListener(message: Message){
    if (message.content.match(/^omae ?wa mou shindeiru$/i)){
        safeSendMessage(message.channel, 'NANI?!');
    }
}
