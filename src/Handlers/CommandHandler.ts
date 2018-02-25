import {MessageType} from "../Interfaces/Enum";
import getInvite from "../Commands/Self/getInvite";
import nuke from "../Commands/Utilty/Nuke";
import {Client, Message} from "discord.js";
import * as dbg from "debug";

export const debug = {
    silly  : dbg('Bot:CommandHandler:Silly'),
    info   : dbg('Bot:CommandHandler:Info'),
    warning: dbg('Bot:CommandHandler:Warning'),
    error  : dbg('Bot:CommandHandler:Error')
};

export default function commandHandler(
    messageType : MessageType,
    command : string,
    message : Message,
    bot : Client){

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
        }
    }
}