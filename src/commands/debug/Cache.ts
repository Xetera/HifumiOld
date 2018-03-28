import {DiscordAPIError, Message, User} from "discord.js";
import {Database} from "../../database/Database";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {codeBlock} from "../../utility/Markdown";
import {debug} from "../../utility/Logging";
import {APIErrors} from "../../interfaces/Errors";

export default function getCache(message: Message, database : Database){
    const cache = database.guilds.get(message.guild.id);

    const out = JSON.stringify(cache, null, '\t');
    safeSendMessage(message.channel, codeBlock(out)).catch(err => {
        if (err instanceof DiscordAPIError && err.message === APIErrors.MESSAGE_TOO_LONG){
            let retry : string = out.substring(0, out.length - (out.length - 2000 + 3));
            retry += '...';
            safeSendMessage(message.channel, codeBlock(retry));
        }
    });
    debug.info(out);
    //safeSendMessage(message.channel, database.guilds);
}