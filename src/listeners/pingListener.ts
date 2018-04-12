import {Message} from "discord.js";
import {Database} from "../database/Database";
import {LogManager} from "../handlers/logging/logManager";

export default function pingListener(message: Message, database: Database){
    if (message.mentions.everyone){
        LogManager.logPingEveryoneAttempt(message.member, message.channel);
    }

    if (message.mentions.members &&
        message.mentions.members.array().length > 7 /* && database.checkEveryonePings*/){

    }
}
