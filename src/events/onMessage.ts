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
}

export default async function onMessage(message: Discord.Message){
    const alexa = gb.instance.alexa;
    const bot = gb.instance.bot;
    const database = gb.instance.database;
    const messageQueue = gb.instance.messageQueue;
    // we don't want to look at bot messages at all
    if (message.author.bot)
        return;

    else if (!gb.instance.database.ready) {
        message.channel.send(`😰 give me some time to get set up first.`);
        return void debug.info(`Got message from ${message.guild.name} but the DB hasn't finished caching.`);
    }

    const messageType : MessageType = message.guild ? MessageType.GuildMessage : MessageType.PrivateMessage;


    // no need listening for anything for pms since it can be flooded and it's literally useless
    if (messageType === MessageType.GuildMessage)
        middleWare(message);

    // we want to serve the help page to the user even if they have the wrong
    // prefix in case they don't know what the prefix is
    else if (messageType === MessageType.PrivateMessage)
        return DMCommandHandler(message);

    else if (await gb.instance.database.getUserIgnore(message.member))
        return;

    if (message.content === '$help')
        return getHelp(message, []);

    else if (!message.content.startsWith(await gb.instance.database.getPrefix(message.guild.id)))
        return;

    // right now this only supports 1 char length prefix but we can change that later
    else if (gb.instance.commandHandler !== undefined)
        return gb.instance.commandHandler.handler(message);
}
