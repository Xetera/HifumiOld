import {Message} from "discord.js";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {safeGetArgs} from "../../utility/Util";
const sources = require('./Sources.json');

export default function source(message: Message, input: [string] | undefined){
    const command = safeGetArgs(input, null);
    if (!command)
        return message.channel.send('https://github.com/ilocereal/Hifumi');
    if (!sources[command])
        return safeSendMessage(message.channel, `${command} is not a valid command.`);
    safeSendMessage(message.channel, sources[command]);
}
