import {Collection, Message, RichEmbed} from "discord.js";
import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
import {debug} from "../utility/Logging";
import {getOnOff, getYesNo} from "../utility/Util";

export default function resolveBooleanUncertainty(message: Message, queryMessage: string | RichEmbed, waitAmount: number): Promise<boolean | undefined>{
    return message.channel.send(queryMessage).then((query: Message|Message[]) => {
        return Promise.all([message.channel.awaitMessages((arg: Message) => {
            return arg.author.username === message.author.username;
        }, {max: 1, time:waitAmount}), <Message> query]);
    }).then(async(r: [Collection<string, Message>, Message]) => {
        // guaranteed 0 or 1 response
        let [collection, msg] = r;
        let resolved: boolean | undefined;
        if (collection.size) {
            const userInput = collection.first();
            const response = userInput.content;
            resolved = getYesNo(response.trim());
            userInput.delete();
        }

        msg.delete();
        // resolved is automatically undefined when
        // the user lets the promise time out
        if (!resolved && !collection.size){
            message.channel.send('Ignored? Feels bad man...');
        }
        // resolved can also be false
        else if (resolved === undefined){
            await handleFailedCommand(
                message.channel, `I was looking for a yes or no response there, not ${collection.first().content}.`
            );
        }
        return resolved;
    }).catch(err => {
        debug.error(err);
        return Promise.reject(err);
    })
}
