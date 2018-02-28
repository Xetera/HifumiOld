import {Instance} from "../Misc/Globals";
import {MessageType} from "../Interfaces/Enum";
import {Message} from "discord.js";
import {debug} from "./CommandHandler";
import setPrefix from "../Commands/Utilty/SetPrefix";
import ch from "../Commands/Fun/CyanideAndHappiness";
import nuke from "../Commands/Utilty/Nuke";
import getPfp from "../Commands/Info/GetPfp";
import systemsEval from "../Commands/Self/Eval";
import echo from "../Commands/Utilty/Echo";
import uptime from "../Commands/Info/Uptime";
import source from "../Commands/Info/Source";
import {getHelp} from "../Commands/Info/Help";
import setDefaultChannel from "../Commands/Utilty/SetDefaultChannel";
import serverInfo from "../Commands/Info/ServerInfo";
import manualRestockUsers from "../Actions/ManualRestockUsers";
import getInvite from "../Commands/DM/getInvite";
import getDMHelp from "../Commands/DM/DMHelp";

export default function DMCommandHandler(message : Message, instance : Instance) : void {
    const bot = instance.bot;
    const database = instance.database;

    debug.info(`[DM]<${message.author.username}>: ${message.content}`);

    // kind of a bad way to check but there won't be many DM
    // commands anyways so it's ok
    if (message.content.includes('invite')){
        message.channel.send(getInvite(bot));
    }
    else if (message.content.includes('help')){
        message.channel.send(getDMHelp());
    }
}