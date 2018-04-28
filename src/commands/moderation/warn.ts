import {GuildMember, Message} from "discord.js";
import strike from "./strike";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";

export default function warn(message: Message, input: [GuildMember, string]){
    const [member, reason] = input;
    if (Number.isInteger(Number(reason.split(' ')[0]))){
        return void handleFailedCommand(
            message.channel, `Warn doesn't require a strike weight.`
        )
    }
    return strike(message, [member, 0, reason]);
}
