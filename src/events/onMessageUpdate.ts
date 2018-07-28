import * as Discord from 'discord.js'
import {discordInviteRegex} from "../listeners/Regex";
import {debug} from '../utility/Logging'
import {LogManager} from "../handlers/logging/logManager";
import deleteInvite from "../moderation/InviteRemover";
import {IDatabase} from "../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";
import {IClient} from "../interfaces/injectables/client.interface";

export default async function onMessageUpdate(oldMessage : Discord.Message, newMessage : Discord.Message){
    const database: IDatabase = Container.get(IDatabase);
    const bot: IClient = Container.get(IClient);
    if (!newMessage.guild
        || bot.sleeping
        || !newMessage.guild.available
        || !database.ready
        ||(newMessage.guild && !await database.getGuildColumn(newMessage.guild.id, 'enabled'))){
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
