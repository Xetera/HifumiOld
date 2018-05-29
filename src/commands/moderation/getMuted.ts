import {Message} from "discord.js";
import gb from "../../misc/Globals";

export default function getMuted(message: Message){
    const output = gb.instance.muteQueue.getMutedUsers(message.guild);
    if (!output)
        return;
    message.channel.send(output);
}
