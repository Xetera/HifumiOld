import * as Discord from 'discord.js'
import {discordInviteRegex} from "../listeners/Regex";
import {debug} from '../utility/Logging'
import {LogManager} from "../handlers/logging/logManager";
import deleteInvite from "../moderation/InviteRemover";
import {gb} from "../misc/Globals";

export default async function onMessageUpdate(oldMessage : Discord.Message, newMessage : Discord.Message){
    if (!newMessage.guild
        || gb.sleeping
        || !newMessage.guild.available
        || !gb.database.ready
        ||(newMessage.guild && !await gb.database.getGuildEnabled(newMessage.guild.id))){
        return
    }

    if (newMessage.content.match(discordInviteRegex)
         && !(newMessage.member.hasPermission('BAN_MEMBERS')|| newMessage.member.hasPermission('ADMINISTRATOR')) ){

        deleteInvite(newMessage, true).then((message : number) => {
            if (message) {
                debug.warning(`Deleted an edited invite from ${oldMessage.author.username}\n` +  newMessage.content, 'onMessageUpdate');
                LogManager.logIllegalEditedInvited(oldMessage, newMessage);
            }
        });
    }
}
