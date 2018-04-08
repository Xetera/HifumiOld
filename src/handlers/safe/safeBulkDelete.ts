import {getBulkDeleteCount} from "../../utility/Settings";
import {
    Channel,
    Collection, DiscordAPIError,
    GuildMember,
    Message,
    Snowflake,
    TextBasedChannel,
    TextChannel
} from "discord.js";
import moment = require("moment");
import {debug} from "../../utility/Logging";

export default function safeBulkDelete(channel: Channel, member: GuildMember){
    if (!(channel instanceof TextBasedChannel(TextChannel))){
        return;
    }
    const dateLimit: Date = moment(new Date()).subtract('14', 'd').toDate();
    return channel.fetchMessages({limit: getBulkDeleteCount()}).then((messages : Collection<Snowflake, Message>) => {
        const userMessages = messages.filter(
            // we want to avoid fetching messages that are created over 14 days ago
            message => message.author.id === member.id && message.createdAt >  dateLimit
        );
        return void channel.bulkDelete(userMessages);
    }).catch((error: Error)=> {
        if (error instanceof DiscordAPIError){
            debug.error(`A Discord error occurred while trying to bulk delete messages by ${member.user.username}\n` + error.stack, 'SafeBulkDelet');
        }
        Promise.reject(error);
    });
}
