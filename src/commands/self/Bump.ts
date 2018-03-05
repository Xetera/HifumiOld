import * as Discord from 'discord.js'
export default function bump(message: Discord.Message){
    const members = message.guild.members;
    const bots = [];
    if (members.get('222853335877812224')){
        bots.push('ServerHound');
        message.channel.send('=bump');
    }

    if (members.get('212681528730189824')){
        bots.push('DLM');
        message.channel.send('dlm!bump');
    }

    if (!('DLM' in bots) && !('ServerHound' in bots)){
        message.channel.send('No advertising bots were found in the server.');
    }

}