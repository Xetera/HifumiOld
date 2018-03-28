import * as Discord from 'discord.js'
import {TextChannel, VoiceChannel} from "discord.js";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import gb from "../../misc/Globals";
import {handleFailedCommand, handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
export default function echo(message:Discord.Message, args: string[]) : void {
    if (!args.length){
        handleInvalidParameters(message.channel, `echo`);
        return;
    }
    const mention : any = args.shift();
    let channel: Discord.Channel | undefined;

    const youTried = gb.emojis.get('alexa_you_tried');
    const regexFind = mention.match(new RegExp('\\d{18}', 'm'));
    if (regexFind.length){
        channel = message.guild.channels.get(regexFind[0])!;
    }

    if (!channel){
        handleFailedCommand(message.channel,`${mention} is not a valid channel.`);
        return;
    }

    if(channel && !message.member.permissionsIn(channel).has('SEND_MESSAGES')){
        handleFailedCommand(message.channel,
            `Nope, if the server doesn't let you write there, I can't write for you either.`);
        return;
    }

    const echo = args.join(' ');

    if (channel instanceof TextChannel){
        let out;
        // we still want admins to be able to make announcements with this
        if (!message.member.hasPermission('ADMINISTRATOR')){
            out = echo.replace('@', '\`@\`');
        }
        else {
            out = echo;
        }
        channel.send(out);
    }
    else if (channel instanceof VoiceChannel){
        handleFailedCommand(message.channel, channel + ' is not a text channel.');
    }
}