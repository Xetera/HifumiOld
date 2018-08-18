import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

async function run(message: Message): Promise<any> {
    safeSendMessage(message.channel, 'https://p.datadoghq.com/sb/71d9e3d68-233c63b5d43908deb0df73c63059cdb2')
}

export const command: Command = new Command(
    {
        names: ['stats'],
        info: 'Sends some stats about myself.',
        usage: '{{prefix}}',
        examples: ['{{prefix}}'],
        category: 'Info',
        expects: [{type: ArgType.None}],
        run: run,
    }
);
