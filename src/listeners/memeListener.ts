import {Message} from "discord.js";

export default function memeListener(message: Message){
    if (message.content.match(/omae ?wa mou shindeiru/i)){
        message.channel.send('NANI?!');
    }
}
