import * as Discord from'discord.js'
import * as dbg from 'debug'
import {Cleverbot} from '../API/Cleverbot'
import {MessageQueue} from "../moderation/MessageQueue";
import inviteListener from '../listeners/InviteListener'
import * as moment from "moment";
import {Database} from "../database/Database";
import {MessageType} from "../interfaces/identifiers";
import commandHandler from "../handlers/commands/CommandHandler";
import {default as gb, Instance} from "../misc/Globals";
import {getHelp} from "../commands/info/help/Help";
import DMCommandHandler from "../handlers/commands/DMCommandHandler";
import pingListener from "../listeners/pingListener";
import memeListener from "../listeners/memeListener";

export const debug = {
    silly: dbg('Bot:onMessage:Silly'),
    info: dbg('Bot:onMessage:Info'),
    warning: dbg('Bot:onMessage:Warning'),
    error: dbg('Bot:onMessage:Error')
};

interface Message extends Discord.Message {
    sent : Date;
}

function middleWare(msg: Discord.Message){
    const messageQueue = gb.instance.messageQueue;
    const alexa = gb.instance.alexa;
    const watchlist = gb.instance.trackList;
    const bot = gb.instance.bot;
    const database = gb.instance.database;
    //casting
    const message = <Message> msg;
    message.sent = moment(new Date()).toDate();
    messageQueue.add(message);
    alexa.checkMessage(message, bot);
    pingListener(message, database);
    inviteListener(message, database);
    memeListener(message);
}

export default async function onMessage(message: Discord.Message){
    // we don't want to look at bot messages at all
    if (message.author.bot)
        return;

    else if (!gb.instance || !gb.instance.database.ready) {
        //message.channel.send(`😰 give me some time to get set up first.`);
        return void debug.info(`Got message from ${message.guild.name} but the DB hasn't finished caching.`);
    }
    if (await gb.instance.database.isUserIgnored(message.member))
        return;

    const messageType : MessageType = message.guild ? MessageType.GuildMessage : MessageType.PrivateMessage;


    // no need listening for anything for pms since it can be flooded and it's literally useless
    if (messageType === MessageType.GuildMessage)
        middleWare(message);

    // we want to serve the help page to the user even if they have the wrong
    // prefix in case they don't know what the prefix is
    else if (messageType === MessageType.PrivateMessage)
        return DMCommandHandler(message);



    else if (!message.content.startsWith(await gb.instance.database.getPrefix(message.guild.id)))
        return;

    // right now this only supports 1 char length prefix but we can change that later
    return gb.instance.commandHandler.handler(message);
}
