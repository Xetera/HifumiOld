import * as Discord from 'discord.js'
import {DiscordAPIError, Message, VoiceChannel} from "discord.js";
import {APIErrors} from "../../interfaces/Errors";
import {debug} from '../../utility/Logging'

export default function safeSendMessage
(channel : Discord.Channel, message: string | number | object, deleteAfter?: number): Promise<Message|Message[]> {
    let out : string;
    if (typeof message === 'number'){
        out = message.toString();
    }
    else if (typeof message === 'object'){
        out = JSON.stringify(message, null, '\t');
    }
    else {
        out = message;
    }
    if (channel instanceof Discord.TextChannel){
        if (!channel.guild.available) {
            debug.error(`Guild ${channel.guild.name} is not available.`);
            return Promise.reject(`Guild ${channel.guild.name} is not available.`);
        }
        return channel.send(out).then((message: Message | Message[]) => {
            if (message instanceof Message && deleteAfter){
                message.delete(deleteAfter * 1000);
            }
            return Promise.resolve(message);
        }).catch((err: any )=> {
            if (err instanceof DiscordAPIError){
                if (err.message === APIErrors.MISSING_PERMISSIONS){
                    debug.error(`Could not send message to ${channel.name} in ${channel.guild.name}, missing permissions`
                    , 'safeSendMessage');
                    // TODO: Mod logging errors
                    return Promise.reject(err);
                }
                else if (err.message === APIErrors.MESSAGE_TOO_LONG){
                    debug.error(`Message was over 2000 characters.\n` + err.stack, 'safeSendMessage');
                    return Promise.reject(err);
                }
                else if (err.message ===APIErrors.UNKNOWN_GUILD){
                    debug.error(`Unknown guild ${channel.guild.name}.\n` + err.stack, 'safeSendMessage');
                    return Promise.reject(err);
                }
                else if (err.message === APIErrors.CANNOT_SEND_EMPTY_MESSAGE){
                    debug.error(`Tried to send an empty message to ${channel.name}\n` + err.stack, 'safeSendMessage');
                    return Promise.reject(err);
                }

                debug.error(`Unexpected Discord API error while sending message to channel ${channel.name}\n` + err.stack,
                    'safeSendMessage');
                return Promise.reject(err);
            }
            debug.error(`Unexpected error while sending message to channel ${channel.name}\n` + err.stack, 'safeSendMessage');
            return Promise.reject(err);
        })
    }
    return Promise.reject(`Target channel ${channel instanceof VoiceChannel ? channel.name:'unknown'} is not a Text Channel.`)
}