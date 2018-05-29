import {Message} from "discord.js";
import gb from "../../../misc/Globals";
import {ORMUpdateResult} from "../../../database/Database";
import {Guild} from "../../../database/models/guild";
import safeSendMessage from "../../../handlers/safe/SafeSendMessage";

export default function removeLogs(message: Message){
    gb.instance.database.removeLogsChannel(message.guild.id).then((r: ORMUpdateResult<Guild>) => {

        safeSendMessage(message.channel, `That setting is now gone`);
    })
}
