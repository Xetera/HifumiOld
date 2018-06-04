import {Message} from "discord.js";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {safeGetArgs} from "../../utility/Util";
const sources = require('./Sources.json');

export default function source(message: Message){
    return message.channel.send('https://github.com/ilocereal/Hifumi');
}
