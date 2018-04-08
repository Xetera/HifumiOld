import * as Discord from'discord.js'
import * as dbg from 'debug'
import {Alexa} from '../API/Alexa'
import {MessageQueue} from "../moderation/MessageQueue";
import inviteListener from '../listeners/InviteListener'
import * as moment from "moment";
import {Database} from "../database/Database";
import {MessageType} from "../interfaces/identifiers";
import commandHandler from "../handlers/commands/CommandHandler";
import {Instance} from "../misc/Globals";
import {getHelp} from "../commands/info/help/Help";
import DMCommandHandler from "../handlers/commands/DMCommandHandler";

export const debug = {
    silly: dbg('Bot:onMessage:Silly'),
    info: dbg('Bot:onMessage:Info'),
    warning: dbg('Bot:onMessage:Warning'),
    error: dbg('Bot:onMessage:Error')
};

interface Message extends Discord.Message {
    sent : Date;
}

function middleWare(msg: Discord.Message, instance: Instance){
    const messageQueue = instance.messageQueue;
    const alexa = instance.alexa;
    const watchlist = instance.trackList;
    const bot = instance.bot;
    const database = instance.database;
    //casting
    const message = <Message> msg;
    message.sent = moment(new Date()).toDate();
    messageQueue.add(message);
    alexa.checkMessage(message, bot);
    inviteListener(message, database);
}

export default function onMessage(message: Discord.Message, instance: Instance){
    const alexa = instance.alexa;
    const bot = instance.bot;
    const database = instance.database;
    const messageQueue = instance.messageQueue;
    // we don't want to look at bot messages at all
    if (message.author.bot) return;
    const messageType : MessageType = message.guild ? MessageType.GuildMessage : MessageType.PrivateMessage;


    // no need listening for anything for pms since it can be flooded and it's literally useless
    if (messageType === MessageType.GuildMessage)
        middleWare(message,instance);

    // we want to serve the help page to the user even if they have the wrong
    // prefix in case they don't know what the prefix is
    else if (messageType === MessageType.PrivateMessage)
        return DMCommandHandler(message, instance);

    else if (database.getIgnored(message.member))
        return;

    if (message.content === '$help') return getHelp(message, [], database);

    else if (!message.content.startsWith(database.getPrefix(message.guild.id))) return;

    // right now this only supports 1 char length prefix but we can change that later
    else if (instance.commandHandler !== undefined)
        instance.commandHandler.handler(message, instance);
}
