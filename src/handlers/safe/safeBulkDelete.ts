import {getBulkDeleteCount} from "../../utility/Settings";
import {
    Channel,
    Collection, DiscordAPIError,
    Message,
    Snowflake,
    TextChannel
} from "discord.js";
import {debug} from "../../utility/Logging";
import {distributionStat} from "../logging/datadog";

export default async function safeBulkDelete(channel: Channel, messages?:  Message[]): Promise<number> {
    if (!(channel instanceof TextChannel)){
        return Promise.reject('Target channel is not a text channel');
    }
    try {
        if (messages && messages.length){
            const deletedMessages = await channel.bulkDelete(messages, true);
            debug.info(`Bulk deleted ${deletedMessages.size} messages from chanel '${channel.name}' in guild ${channel.guild.name}`);
            return deletedMessages.size
        }
        const fetched : Collection<Snowflake, Message> = await channel.fetchMessages({limit: getBulkDeleteCount()});
        const deletedMessages = await channel.bulkDelete(fetched, true);
        debug.info(`Bulk deleted the last ${deletedMessages.size} messages from channel '${channel.name}' in guild ${channel.guild.name}`);
        distributionStat('hifumi.messages.deleted', deletedMessages.size, undefined, ['type:bulk']);
        return deletedMessages.size;
    }

    catch(error){
        if (error instanceof DiscordAPIError){
            debug.error(`A Discord error occurred while trying to bulk delete messages\n` + error.stack, 'SafeBulkDelete');
        }
        return Promise.reject(error);
    }
}
