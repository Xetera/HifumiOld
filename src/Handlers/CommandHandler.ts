import {MessageType} from "../Interfaces/Enum";
import getInvite from "../Commands/Self/getInvite";
import nuke from "../Commands/Utilty/Nuke";
import {Client, Message} from "discord.js";
import * as dbg from "debug";
import {Database} from "../Database/Database";
import setDefaultChannel from "../Commands/Utilty/SetDefaultChannel";
import {IGuild, isIGuild} from "../Database/TableTypes";
import setPrefix from "../Commands/Utilty/SetPrefix";

export const debug = {
    silly  : dbg('Bot:CommandHandler:Silly'),
    info   : dbg('Bot:CommandHandler:Info'),
    warning: dbg('Bot:CommandHandler:Warning'),
    error  : dbg('Bot:CommandHandler:Error')
};

export default function commandHandler(
    messageType : MessageType,
    message : Message,
    bot     : Client,
    database: Database){

    const contentArray : string[] = message.content.split(' ');
    const command : string = contentArray[0].substring(1);
    const args : string[] = contentArray.splice(1, contentArray.length);

    if (messageType === MessageType.PrivateMessage){
        // not allowing all the same commands from
        debug.info(`[DM]<${message.author.username}>: ${message.content}`);

        switch(command.toLowerCase()){
            case "invite":
                message.channel.send(getInvite(bot));
                break;
        }
    }
    else {
        debug.info(`[${message.guild.name}]<${message.author.username}>: ${message.content}`);

        switch(command.toLowerCase()){
            case "nuke":
                nuke(message.channel);
                break;
            case "setprefix":
                setPrefix(message, args[0], database);
                break;
            case "setdefault":
                setDefaultChannel(message.guild.id, message.channel, database);
                break;
        }
    }
}