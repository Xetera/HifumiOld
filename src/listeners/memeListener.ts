import {Message} from "discord.js";

export default function memeListener(message: Message){
    if (message.content.match(/^omae ?wa mou shindeiru$/i)){
        message.channel.send('NANI?!');
    }
    else if (message.content.match(/(have|got) a loicense/i)){
        message.channel.send('oi, got a permit for that loicense?');
    }

}
