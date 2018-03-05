import * as Discord from 'discord.js'
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

export default function bump(message: Discord.Message){
    const members = message.guild.members;
    const bots = [];
    if (members.get('222853335877812224')){
        bots.push('ServerHound');
        safeSendMessage(message.channel, '=bump', 5);
    }

    if (members.get('212681528730189824')){
        bots.push('DLM');
        safeSendMessage(message.channel, 'dlm!bump', 5);
    }

    if (!bots.includes('DLM') && !bots.includes('ServerHound')){
        safeSendMessage(message.channel,'Could not find DLM or ServerHound in the server.', 60);
    }
}