import * as Discord from 'discord.js'
import {TextChannel, VoiceChannel} from "discord.js";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import gb from "../../misc/Globals";
export default function echo(message:Discord.Message, args: string[]) : void {
    const mention : any = args[0];
    let channel : Discord.Channel;

    const youTried = gb.emojis.get('alexa_you_tried');
    const regexFind = mention.match(new RegExp('\\d{18}', 'm'));
    if (regexFind.length){
        channel = message.guild.channels.get(regexFind[0]);
    }
    else {
        safeSendMessage(message.channel,`${mention} is not a valid channel.`);
        return
    }
    console.log('channel ' + channel);

    if(!message.member.permissionsIn(channel).has('SEND_MESSAGES')){
        safeSendMessage(message.channel,
            `Nope, if the server doesn't let you write there, I can't write for you either.`);
    }

    const echo = args.splice(1).join(' ');

    if (channel instanceof TextChannel){
        echo.replace('@', '`@`');
        channel.send(echo);
    }
    else if (channel instanceof VoiceChannel){
        message.channel.send(channel + ' is not a text channel.');
    }
}