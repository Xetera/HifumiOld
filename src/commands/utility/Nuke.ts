import {Channel, Collection, Message, Snowflake, TextChannel} from "discord.js";
import {randomRuntimeError} from "../../interfaces/Replies";

export default async function nuke(message: Message, input: [number] | undefined ) {
    const channel = message.channel;
    const limit = Array.isArray(input) ? input.shift() : 50;
    if (channel instanceof TextChannel){
        const messages : Collection<Snowflake, Message> = await channel.fetchMessages({limit: limit});
        channel.bulkDelete(messages).catch(err => {
            channel.send(randomRuntimeError());
            console.log("Error bulk deleting:\n", err);
        });
    }
}
