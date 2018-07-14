import {Instance} from "../../misc/Globals";
import {Message} from "discord.js";
import {debug} from "../../utility/Logging";
import getInvite from "../../commands/DM/getInvite";
import getDMHelp from "../../commands/DM/DMHelp";
import safeSendMessage from "../safe/SafeSendMessage";
import inviteEmbed from "../../embeds/commands/inviteEmbed";

export default function DMCommandHandler(message : Message) : void {
    debug.info(`[DM]<${message.author.username}>: ${message.content}`);

    // kind of a bad way to check but there won't be many DM
    // commands anyways so it's ok
    if (message.content.includes('invite')){
        message.channel.send(inviteEmbed()).catch(err => {
            debug.error(`Error dming user ${message.author.username}`);
            debug.error(err);
            return;
        })
    }
    else if (message.content.includes('help')){
        message.channel.send(getDMHelp()).catch(err => {
            debug.error(`Error dming user ${message.author.username}`);
            debug.error(err);
            return;
        })
    }
}
