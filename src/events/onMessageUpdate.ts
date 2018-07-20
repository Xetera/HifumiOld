import * as Discord from 'discord.js'
import {discordInviteRegex} from "../listeners/Regex";
import safeDeleteMessage from "../handlers/safe/SafeDeleteMessage";
import {debug} from '../utility/Logging'
import {Message} from "discord.js";
import {LogManager} from "../handlers/logging/logManager";
import logEditedInviteMessageEmbed from "../embeds/logging/logEditedInviteMessageEmbed";
import deleteInvite from "../moderation/InviteRemover";
import {default as gb} from "../misc/Globals";
import {APIErrors} from "../interfaces/Errors";

export default async function onMessageUpdate(oldMessage : Discord.Message, newMessage : Discord.Message){
    if (!newMessage.guild
        || gb.sleeping
        || !newMessage.guild.available
        || !gb.instance.database.ready
        ||(newMessage.guild && !await gb.instance.database.getGuildEnabled(newMessage.guild.id))){
        return
    }


    const allowedInvites = (newMessage.member.hasPermission('BAN_MEMBERS')|| (newMessage.member.hasPermission('ADMINISTRATOR')));
    const guildAllowsInvites = await gb.instance.database.getAllowGuildInvites(oldMessage.guild.id);
    if (newMessage.content.match(discordInviteRegex)
        && !guildAllowsInvites
         && !allowedInvites){

        deleteInvite(newMessage, true).then((message : number) => {
            if (message) {
                debug.warning(`Deleted an edited invite from ${oldMessage.author.username}\n` +  newMessage.content, 'onMessageUpdate');
                LogManager.logIllegalEditedInvited(oldMessage, newMessage);
            }
        }).catch(err => {
            if (err.message === APIErrors.MISSING_PERMISSIONS){
                debug.info(`Could not remove an invite from ${oldMessage.guild.name}, missing permissions.`);
            }
            debug.info(err);
        });
    }
}
