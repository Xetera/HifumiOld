import {DiscordAPIError, DMChannel, GuildMember, Message, RichEmbed, User} from "discord.js";
import * as dbg from 'debug'
import {APIErrors} from "../../interfaces/Errors";

const debug = {
    info: dbg('Bot:DeleteMessage:Info'),
    warning: dbg('Bot:DeleteMessage:Warning'),
    error: dbg('Bot:DeleteMessage:Error')
};

export default function safeMessageUser(member: GuildMember, message : string | RichEmbed, reason ?: string, ban?: boolean) : Promise<void> {
    if (ban && !member.guild.me.hasPermission('BAN_MEMBERS')){
        return Promise.reject(`Could not message user about a ban, missing ban permissions`);
        // do some logging here
    }

    const messageReason : string = reason ? `for reason: ${reason}` : "";

    return member.createDM().then((channel: DMChannel) => {
        return channel.send(message);
    }).then(() => {
        return void debug.info(`Messaged user ${member.user.username} because:\n${messageReason}.`);
    }).catch(error => {
        if (error instanceof DiscordAPIError) {
            if (error.message === APIErrors.CANNOT_MESSAGE_USER) {
                debug.info(`Tried to message ${member.user.username} but couldn't.`)
            }
            else {
                debug.error(error);
            }
        }
        else {
            debug.error(`Unexpected error while trying to message  ` +
                `${member.user.username} ${reason}.`, error);
        }
        // we don't want to reject here because we're already handling everything here
    });
}
