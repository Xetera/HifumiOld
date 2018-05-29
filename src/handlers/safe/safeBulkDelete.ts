import {getBulkDeleteCount} from "../../utility/Settings";
import {
    Channel,
    Collection, DiscordAPIError,
    GuildMember,
    Message,
    Snowflake,
    TextChannel
} from "discord.js";
import moment = require("moment");
import {debug} from "../../utility/Logging";

export default function safeBulkDelete(channel: Channel, member:  Message[] | Collection<string, Message>): Promise<number> {
    if (!(channel instanceof TextChannel)){
        return Promise.reject('Target channel is not a text channel');
    }
    const dateLimit: Date = moment(new Date()).subtract('14', 'd').toDate();
    return channel.fetchMessages({limit: getBulkDeleteCount()}).then((messages : Collection<Snowflake, Message>) => {
        const userMessages = messages.filter(
            // we want to avoid fetching messages that are created over 14 days ago
            message => message.createdAt >  dateLimit
        );
        return channel.bulkDelete(userMessages);
    }).then(col => {
      return col.size;
    }).catch((error: Error)=> {
        if (error instanceof DiscordAPIError){
            debug.error(`A Discord error occurred while trying to bulk delete messages\n` + error.stack, 'SafeBulkDelet');
        }
        return Promise.reject(error);
    });
}
