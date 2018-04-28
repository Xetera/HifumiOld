import {Channel, Collection, DiscordAPIError, Message, Snowflake, TextChannel} from "discord.js";
import {randomRuntimeError} from "../../interfaces/Replies";
import {Database} from "../../database/Database";
import gb from "../../misc/Globals";
import {safeGetArgs} from "../../utility/Util";

export default async function cleanse(channel : Channel, input: [number] | undefined ) {
    const limit = safeGetArgs(input, 50);
    if (channel instanceof TextChannel){
        if (!channel.guild.members.find('id', channel.client.user.id).hasPermission("MANAGE_MESSAGES"))
            return channel.send(`${gb.emojis.get('alexa_feels_bad_man')} I'm not allowed to delete messages...`);

        const prefix = await gb.instance.database.getPrefix(channel.guild.id);
        const messages : Collection<Snowflake, Message> = await channel.fetchMessages({limit: limit});

        const botMessages = messages.filter(function(message){
            return message.author.bot || message.content.startsWith(prefix);
        });

        channel.bulkDelete(botMessages).catch(err => {
            channel.send(randomRuntimeError());
            console.log("Error bulk deleting:\n", err);
        });
    }
}
