import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";

async function run(message: Message): Promise<any> {
    const members = message.guild.members;
    const bots: string[] = [];
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

export const command: Command = new Command(
    {
        names: ['bump'],
        info: 'Bumps the server if ServerHound or DLM are on the server.',
        usage: '{{prefix}}bump',
        examples: ['{{prefix}}bump'],
        category: 'Utility',
        expects: [{type: ArgType.None}],
        run: run
    }
);
