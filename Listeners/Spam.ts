import * as Discord from 'discord.js'
import * as Moment from 'moment'
import {securityLevel, SecurityLevels, getSpamTolerance, getMuteDuration} from "../Settings";
import {debug, log} from "../Logging";


export async function checkForSpam(message: Discord.Message){
    if (message.channel instanceof Discord.TextChannel){

        const channel   : Discord.TextChannel = message.channel;
        const author    : Discord.User = message.author;
        const threshold : Date = Moment(new Date()).subtract(5, 's').toDate();

        const messages = await channel.fetchMessages({limit: 30});
        // fetching messages from the author
        const userMessages : Discord.Collection<Discord.Snowflake, Discord.Message>  = messages.filter(msg =>
            msg.author.id === author.id && msg.createdAt > threshold // get messages sent within the last 5s
        );

        // variable spam tolerance based on security level
        const tolerance = getSpamTolerance();

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
            log(message.member.guild,
                `\`\`\`Deleted ${deletedMessagesCount} messages from spammer [${author.username}] in #${message.channel.name}\`\`\``);

            const muted : any = message.guild.roles.find('name', 'muted');

            if (!muted)
                return debug.warning(`Spammer ${author.username} could not be muted, missing 'muted' role.`);

            const mutedMember = await message.member.addRole(muted);

            log(message.member.guild,
                `[${mutedMember || author.username}] was muted for ${getMuteDuration() / 1000} seconds for spamming.`);

            setTimeout(function(){ // removing mute
                message.member.removeRole(muted);
            }, getMuteDuration());

        }
    }
}