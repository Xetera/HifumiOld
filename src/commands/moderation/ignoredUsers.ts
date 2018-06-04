import {Message} from "discord.js";
import gb from "../../misc/Globals";
import {User} from "../../database/models/user";
import ignoredEmbed from "../../embeds/moderation/ignoredUsersEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {IgnoredChannel} from "../../database/models/ignoredChannel";

export default async function ignoredUsers(message: Message){
    Promise.all([
        gb.instance.database.getIgnoredChannels(message.guild.id),
        gb.instance.database.getIgnoredUsers(message.guild.id)
    ]).then((res: [IgnoredChannel[], User[]]) => {
        safeSendMessage(message.channel, ignoredEmbed(res, message.guild));
    });
}
