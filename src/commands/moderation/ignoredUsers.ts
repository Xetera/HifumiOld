import {Message} from "discord.js";
import gb from "../../misc/Globals";
import {User} from "../../database/models/user";
import ignoredUsersEmbed from "../../embeds/moderation/ignoredUsersEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

export default async function ignoredUsers(message: Message){
    gb.instance.database.getIgnoredUsers(message.guild.id).then((users: User[]) => {
        safeSendMessage(message.channel, ignoredUsersEmbed(users, message.guild));
    })
}
