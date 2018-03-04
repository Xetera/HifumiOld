import * as Discord from 'discord.js'
import {discordInviteRegex} from "../listeners/Regex";
import safeDeleteMessage from "../handlers/SafeDeleteMessage";
import {debug} from '../utility/Logging'
export default function onMessageUpdate(oldMessage : Discord.Message, newMessage : Discord.Message){
    if (newMessage.content.match(discordInviteRegex)){
        safeDeleteMessage(newMessage).then((message : Discord.Message) => {
            debug.warning(`Deleted an edited invite from ${message.author.username}\n`, message.content);
            // TODO: add a staff log for this part
        });
    }
}