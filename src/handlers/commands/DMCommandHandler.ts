import {Instance} from "../../misc/Globals";
import {Message} from "discord.js";
import {debug} from "./CommandHandler";
import getInvite from "../../commands/DM/getInvite";
import getDMHelp from "../../commands/DM/DMHelp";

export default function DMCommandHandler(message : Message, instance : Instance) : void {
    debug.info(`[DM]<${message.author.username}>: ${message.content}`);

    // kind of a bad way to check but there won't be many DM
    // commands anyways so it's ok
    if (message.content.includes('invite')){
        message.channel.send(getInvite());
    }
    else if (message.content.includes('help')){
        message.channel.send(getDMHelp());
    }
}