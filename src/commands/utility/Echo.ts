import * as Discord from 'discord.js'
import {TextChannel, VoiceChannel} from "discord.js";
export default function echo(message:Discord.Message, args: string[]) : void {
    const echo = args.splice(1).join(' ');
    const channel : Discord.Channel= message.guild.channels.find('id',  args[0]);

    if (channel instanceof TextChannel){
        echo.replace('@', '`@`');
        channel.send(echo);
    }
    else if (channel instanceof VoiceChannel){
        message.channel.send(channel + ' is not a text channel.');
        return;
    }
    else {
        return;
    }
}