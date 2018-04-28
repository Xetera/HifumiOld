import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
import {debug} from "../utility/Logging";
import {Collection, Message, RichEmbed} from "discord.js";

export default function resolveNumberedUncertainty(message: Message, queryMessage: string | RichEmbed, entities: any[], waitAmount: number, type: 'user' | 'channel'){
    return message.channel.send(queryMessage).then((query: Message|Message[]) => {
        return Promise.all([message.channel.awaitMessages(
            (arg: Message) => arg.author.username === message.author.username, {max: 1, time:waitAmount}
        ), <Message> query]);
    }).then(async(r: [Collection<string, Message>, Message]) => {
        // guaranteed 0 or 1 response
        let [collection, msg] = r;
        let resolved;
        if (collection.size) {
            const userInput = collection.first();
            const response = userInput.content;
            resolved = entities[Number(response) - 1];
            userInput.delete();
        }

        msg.delete();
        // resolved is automatically undefined when
        // the user lets the promise time out
        if (!resolved && !collection.size){
            message.channel.send('Ignored? Feels bad man...');
        }
        else if (!resolved && !global){
            await handleFailedCommand(
                message.channel, `That ${type} either doesn't exist or isn't in this server.`
            )
        }
        else if (!resolved){
            await handleFailedCommand(
                message.channel, `I couldn't find the ${type} ${collection.first().content} anywhere, sorry.`
            );
        }
        return resolved;
    }).catch(err => {
        debug.error(err);
        return Promise.reject(err);
    })
}
