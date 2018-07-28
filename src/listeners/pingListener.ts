import {Message, MessageMentions} from "discord.js";
import {LogManager} from "../handlers/logging/logManager";
import {getMuteDate} from "../utility/Settings";
import {Container} from "typescript-ioc";
import {IMuteQueue} from "../interfaces/injectables/muteQueue.interface";

export default function pingListener(message: Message){
    const muteQueue: IMuteQueue = Container.get(IMuteQueue);
    if (message.content.match(MessageMentions.EVERYONE_PATTERN) &&
        !message.member.hasPermission('BAN_MEMBERS')){
        LogManager.logPingEveryoneAttempt(message.member, message.channel, message.content);
    }

    if (message.mentions.members && message.mentions.members.array().length >= 7 &&
        !message.member.hasPermission('BAN_MEMBERS')){
        message.delete().then(() => {
            LogManager.logMentionSpam(message);
            return muteQueue.add(message.member, message.guild.me, getMuteDate(), 'Spamming mentions');
        });
    }
}
