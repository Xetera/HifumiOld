import * as Discord from 'discord.js'
import {MessageQueue} from "../../moderation/MessageQueue";
export default function getQueue(message: Discord.Message, messageQueue : MessageQueue){
    messageQueue.getQueue(message.channel);
}