import {DiscordAPIError, DMChannel, Message, User} from "discord.js";
import * as dbg from 'debug'
import {APIErrors} from "../interfaces/Errors";

const debug = {
    info: dbg('Bot:DeleteMessage:Info'),
    warning: dbg('Bot:DeleteMessage:Warning'),
    error: dbg('Bot:DeleteMessage:Error')
};

export default function safeMessageUser(user : User, message : string, reason ?: string) : Promise<void> {
    const messageReason : string = reason ? `for reason: ${reason}` : "";
    return new Promise<void>(function (resolve) {

        user.createDM().then((channel: DMChannel) => {
            return channel.send(message);
        }).then((message: Message | Message[]) => {
            debug.info(`Messaged user ${user.username} ${messageReason}.`)
            resolve();
        }).catch(error => {
            if (error instanceof DiscordAPIError) {
                if (error.message === APIErrors.CANNOT_MESSAGE_USER) {
                    debug.info(`Tried to message ${user.username} but couldn't.`)
                }
                else {
                    debug.error(error);
                }
            }
            else {
                debug.error(`Unexpected error while trying to message  ` +
                    `${user.username} ${reason}.`, error);
            }
            // we don't want to reject here because we're already handling everything here
        });
    });
}