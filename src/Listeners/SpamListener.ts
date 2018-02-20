import * as Discord from 'discord.js'
import * as Moment from 'moment'
import {securityLevel, SecurityLevels, getSpamTolerance, getMuteDate} from "../../Settings";
import {muteUser} from "../Moderation/MuteUser";
import {debug, log} from "../../Logging";
import {MuteQueue} from "../Moderation/MuteQueue";

export async function checkForSpam(message: Discord.Message, queue : MuteQueue){
    if (message.channel instanceof Discord.TextChannel){

        const channel   : Discord.TextChannel = message.channel;
        const author    : Discord.User = message.author;
        const threshold : Date = Moment(new Date()).subtract(5, 's').toDate();

        const messages = await channel.fetchMessages({limit: 20});
        // fetching messages from the author
        const userMessages : Discord.Collection<Discord.Snowflake, Discord.Message>  = messages.filter(msg =>
            msg.author.id === author.id && msg.createdAt > threshold // get messages sent within the last 5s
        );

        // variable spam tolerance based on security level
        const tolerance = getSpamTolerance();

        // user is already muted
        if (message.member.roles.find('name', 'muted')) return;
        // user has sent more than

        if (userMessages.array().length > tolerance){

            let deletedMessages      : Discord.Collection<Discord.Snowflake, Discord.Message>;
            let deletedMessagesCount : number;

            if (securityLevel === SecurityLevels.Medium)    // delete detected messages
                deletedMessages = await message.channel.bulkDelete(userMessages);
            else if (securityLevel === SecurityLevels.High) // delete every message sent by user
                deletedMessages = await message.channel.bulkDelete(messages.filter(msg => msg.id === author.id));
            else {
                return;
            }

            deletedMessagesCount = deletedMessages.array().length;
            debug.info(`Deleted ${deletedMessagesCount} messages from spammer [${author.username}]`);
            // log(message.member.guild,`Deleted ${deletedMessagesCount} messages from spammer [${author.username}] in #${message.channel.name}`);
            const muteDuration : Date = getMuteDate();
            muteUser(message.member, getMuteDate(), queue);

        }
    }
}