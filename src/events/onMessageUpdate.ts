import * as Discord from 'discord.js'
import {discordInviteRegex} from "../listeners/Regex";
import safeDeleteMessage from "../handlers/safe/SafeDeleteMessage";
import {debug} from '../utility/Logging'
import {Message} from "discord.js";
import {LogManager} from "../handlers/logging/logManager";
import logEditedInviteMessageEmbed from "../embeds/logging/logEditedInviteMessageEmbed";
import deleteInvite from "../moderation/InviteRemover";
import {default as gb} from "../misc/Globals";

export default async function onMessageUpdate(oldMessage : Discord.Message, newMessage : Discord.Message){
    if (!newMessage.guild || !newMessage.guild.available ||(newMessage.guild && !await gb.instance.database.getGuildEnabled(newMessage.guild.id))){
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
