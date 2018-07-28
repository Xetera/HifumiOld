import {ORMUpdateResult} from "../../../database/Database";
import safeSendMessage from "../../../handlers/safe/SafeSendMessage";
import {Message} from "discord.js";
import {Guild} from "../../../database/models/guild";
import {gb} from "../../../misc/Globals";

export default function removeWarnings(message: Message){
    gb.database.removeWarningsChannel(message.guild.id).then((r: ORMUpdateResult<Guild>) => {
        safeSendMessage(message.channel, `That setting is now gone`);

    })
}
