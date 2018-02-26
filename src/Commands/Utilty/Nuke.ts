import {Channel, Collection, Message, Snowflake, TextChannel} from "discord.js";

export default async function nuke(channel : Channel, limit : number = 50) {
    if (channel instanceof TextChannel){
        const messages : Collection<Snowflake, Message> = await channel.fetchMessages({limit: limit});
        channel.bulkDelete(messages);
    }
}