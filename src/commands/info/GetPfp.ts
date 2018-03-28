import * as Discord from 'discord.js'
import * as dbg from "debug";
import {getHelp} from "./help/Help";
import {handleFailedCommand, handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

export const debug = {
    silly  : dbg('Bot:PFP:Silly'),
    info   : dbg('Bot:PFP:Info'),
    warning: dbg('Bot:PFP:Warning'),
    error  : dbg('Bot:PFP:Error')
};
export default function pfp(message: Discord.Message, args : string[]){
    if (!args.length){
        return handleInvalidParameters(message.channel, 'pfp');
    }
    let url : string;
    let user : Discord.User;
    const mentionedMembers = message.mentions.members;
    if (mentionedMembers.array().length > 0){
        try{
            user = mentionedMembers.first().user;
        }
        catch (err){
            debug.error('There was an error fetching user url\n', err);
            return;
        }
    }
    else {
        user = message.guild.members.find('id', args[0]).user;
    }

    if (user)
        url = user.avatarURL;
    else
        return handleFailedCommand(message.channel, args[0] + ' is not a valid user.');

    if (url == null){
        return message.channel.send(`${mentionedMembers.first().displayName} does not have a profile picture.`);
    }

    safeSendMessage(message.channel, url);
}