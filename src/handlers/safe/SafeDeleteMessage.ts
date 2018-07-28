import {DiscordAPIError, Message} from "discord.js";
import {APIErrors} from "../../interfaces/Errors";
import {debug} from "../../utility/Logging";


export default function safeDeleteMessage(message : Message, timeout?: number) : Promise<Message|void>{

    return message.delete(timeout).then((message : Message) => {
        return message;
    }).catch(error => {
        if (error instanceof DiscordAPIError){
            if (error.message === APIErrors.MISSING_PERMISSIONS){
                debug.error(`Could not delete message from ${message.author.username}`+
                    ` in ${message.guild.name}, missing permissions.`, `SafeDeleteMessage`);
            }
            else {
                debug.error(error);
            }
        }
        else {
            debug.error(`Unexpected error while trying to delete message from `+
                `${message.author.username} in ${message.guild.name}.`, `SafeDeleteMessage`);
            debug.error(error)
        }
    })

}
