import {Channel, Collection, Message, Snowflake, TextChannel} from "discord.js";
import {randomRuntimeError} from "../../interfaces/Replies";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

export default async function nuke(message: Message, input: [number] | undefined ) {
    const channel = message.channel;
    const limit = Array.isArray(input) ? input.shift()! : 49;
    if (channel instanceof TextChannel){
        // Adding one because we're also deleting the command message
        const messages : Collection<Snowflake, Message> = await channel.fetchMessages({limit: limit + 1});
        channel.bulkDelete(messages)
            .then((coll: Collection<string, Message>) => {
                safeSendMessage(channel, `Deleted the last ${coll.size - 1} messages.`)
            })
            .catch(err => {
            channel.send(randomRuntimeError());
            console.log("Error bulk deleting:\n", err);
        });
    }
}
