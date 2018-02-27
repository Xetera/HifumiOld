import * as Discord from'discord.js'
import * as dbg from 'debug'
import {Alexa} from '../API/Alexa'
import {MessageQueue} from "../Moderation/MessageQueue";
import inviteListener from '../Listeners/InviteListener'
import * as moment from "moment";
import nuke from "../Commands/Utilty/Nuke";
import {Database} from "../Database/Database";
import {MessageType} from "../Interfaces/Enum";
import getInvite from "../Commands/Self/getInvite";
import commandHandler from "../Handlers/CommandHandler";
import {Instance} from "../Misc/Globals";

export const debug = {
    silly: dbg('Bot:onMessage:Silly'),
    info: dbg('Bot:onMessage:Info'),
    warning: dbg('Bot:onMessage:Warning'),
    error: dbg('Bot:onMessage:Error')
};

interface Message extends Discord.Message {
    sent : Date;
}

function middleWare(
    msg: Discord.Message,
    alexa : Alexa,
    messageQueue : MessageQueue,
    bot : Discord.Client,
    database : Database){

    //casting
    const message = <Message> msg;
    message.sent = moment(new Date()).toDate();

    messageQueue.add(message);
    alexa.checkMessage(message, bot);
    inviteListener(message, database);
}

export default function onMessage(
    message: Discord.Message,
    instance: Instance){
    const alexa = instance.alexa;
    const bot = instance.bot;
    const database = instance.database;
    const messageQueue = instance.messageQueue;
    // we don't want to look at bot messages at all
    if (message.author.bot) return;
    const messageType : MessageType = message.guild ? MessageType.GuildMessage : MessageType.PrivateMessage;

    // no need listening for anything for pms since it can be flooded and it's literally useless
    if (messageType === MessageType.GuildMessage)
        middleWare(message, alexa, messageQueue, bot, database);

    // we will change this later to fetch and cache prefixes on a per-server basic
    if (!database.getPrefix(message.guild.id)) return;
    // right now this only supports 1 char length prefix but we can change that later

    commandHandler(messageType, message, bot, database);
}