import {Message, MessageMentions} from "discord.js";
import {Database} from "../database/Database";
import {LogManager} from "../handlers/logging/logManager";
import {gb} from "../misc/Globals";
import {getMuteDate} from "../utility/Settings";

export default function pingListener(message: Message, database: Database){
    if (message.content.match(MessageMentions.EVERYONE_PATTERN) &&
        !message.member.hasPermission('BAN_MEMBERS')){
        LogManager.logPingEveryoneAttempt(message.member, message.channel, message.content);
    }

    if (message.mentions.members && message.mentions.members.array().length >= 7 &&
        !message.member.hasPermission('BAN_MEMBERS')){
        message.delete().then(() => {
            LogManager.logMentionSpam(message);
            return gb.muteQueue.add(message.member, message.guild.me, getMuteDate(), 'Spamming mentions');
        });
    }
}
