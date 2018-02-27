import * as Discord from 'discord.js'
import * as dbg from "debug";
import {getHelp} from "../Utilty/Help";

export const debug = {
    silly  : dbg('Bot:PFP:Silly'),
    info   : dbg('Bot:PFP:Info'),
    warning: dbg('Bot:PFP:Warning'),
    error  : dbg('Bot:PFP:Error')
};
export default function pfp(message: Discord.Message, args : string[]){
    getHelp();
    let url : string;
    const mentionedMembers = message.mentions.members;
    if (mentionedMembers.array().length > 0){
        try{
            url = mentionedMembers.first().user.avatarURL;
        }
        catch (err){
            debug.error('There was an error fetching user url\n', err);
            return;
        }
    }
    else if (args.length) {
        const member = message.guild.members.find('id', args[0]);
        if (member)
            url = member.user.avatarURL;
        else
            return message.channel.send(args[0] + ' is not a valid user.');
    }
    else {
        return message.channel.send(`${message.member} pfp requires either pinged user or user ID`);
    }
    if (url == null){
        return message.channel.send(`${mentionedMembers.first().displayName} does not have a profile picture.`);
    }

    message.channel.send(url);
}