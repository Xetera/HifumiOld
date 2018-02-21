import * as Discord from'discord.js'
import * as dbg from 'debug'
import {Alexa} from '../API/Alexa'
import {MessageQueue} from "../Moderation/MessageQueue";
import inviteListener from '../Listeners/InviteListener'
import * as moment from "moment";

export const debug = {
    silly: dbg('Bot:onMessage'),
    info: dbg('Bot:onMessage:Info'),
    warning: dbg('Bot:onMessage:Warning'),
    error: dbg('Bot:onMessage:Error')
};

interface Message extends Discord.Message {
    sent : Date;
}

function middleWare
(msg: Discord.Message, alexa : Alexa, messageQueue : MessageQueue, bot : Discord.Client){
    //casting
    const message = <Message> msg;
    message.sent = moment(new Date()).toDate();

    // we don't want to look at bot messages at all
    messageQueue.add(message);
    alexa.checkMessage(message, bot);
    inviteListener(message);

}

export default function onMessage
(msg: Discord.Message, alexa : Alexa, messageQueue : MessageQueue, bot : Discord.Client){
    if (msg.author.bot) return;

    middleWare(msg, alexa, messageQueue, bot);

    // we will change this later to fetch and cache prefixes on a per-server basic
    if (!msg.content.startsWith('.')) return;
    debug.info(`[${msg.guild.name}] ${msg.author.username} wrote: ${msg.content}`);

}