import {Instance} from "../misc/Globals";
import {MessageType} from "../interfaces/identifiers";
import {Message} from "discord.js";
import {debug} from "./CommandHandler";
import setPrefix from "../commands/config/SetPrefix";
import ch from "../commands/fun/CyanideAndHappiness";
import nuke from "../commands/utility/Nuke";
import getPfp from "../commands/info/GetPfp";
import systemsEval from "../commands/debug/Eval";
import echo from "../commands/utility/Echo";
import uptime from "../commands/info/Uptime";
import source from "../commands/info/Source";
import {getHelp} from "../commands/info/Help";
import setDefaultChannel from "../commands/config/setWelcomeChannel";
import serverInfo from "../commands/info/ServerInfo";
import manualRestockUsers from "../actions/ManualRestockUsers";
import getInvite from "../commands/DM/getInvite";
import getDMHelp from "../commands/DM/DMHelp";

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