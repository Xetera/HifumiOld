import {Message} from "discord.js";
import {Database} from "../../database/Database";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

export default function getCache(message: Message, database : Database){
    const cache = database.guilds.get(message.guild.id);
    message.channel.send(JSON.stringify(cache));
    //safeSendMessage(message.channel, database.guilds);
}