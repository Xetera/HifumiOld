import {Message} from "discord.js";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
const sources = require('./Sources.json');

export default function source(message: Message, args : string[]){
    if (!args.length)
        return message.channel.send('https://github.com/ilocereal/Alexa');
    const command = args[0];
    if (!sources[command])
        return safeSendMessage(message.channel, `${command} is not a valid command.`);
    safeSendMessage(message.channel, sources[command]);
}