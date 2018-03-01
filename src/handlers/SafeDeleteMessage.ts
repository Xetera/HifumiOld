import {DiscordAPIError, Message} from "discord.js";
import * as dbg from 'debug'
import {APIErrors} from "../interfaces/Errors";

const debug = {
    info: dbg('Bot:DeleteMessage:Info'),
    warning: dbg('Bot:DeleteMessage:Warning'),
    error: dbg('Bot:DeleteMessage:Error')
};

export default function safeDeleteMessage(message : Message) : Promise<void>{
    return new Promise<void>(function (resolve) {

        message.delete().then(() => {
            resolve();
        }).catch(error => {
            if (error instanceof DiscordAPIError){
                if (error.message === APIErrors.MISSING_PERMISSIONS){
                    debug.error(`Could not delete message from ${message.author.username}`+
                        ` in ${message.guild.name}, missing permissions.`);
                }
                else {
                    debug.error(error);
                }
            }
            else {
                debug.error(`Unexpected error while trying to delete message from `+
                    `${message.author.username} in ${message.guild.name}.`, error);
            }
            // we don't want to reject here because we're already handling everything here
        })
    });
}