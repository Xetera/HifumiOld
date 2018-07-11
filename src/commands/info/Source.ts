import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";

async function run(message: Message): Promise<any> {
    safeSendMessage(message.channel, 'https://github.com/ilocereal/Hifumi');
}

export const command: Command = new Command(
    {
        names: ['source'],
        info: 'Sends my source code from github.',
        usage: '{{prefix}}source',
        examples: ['{{prefix}}source'],
        category: 'Info',
        expects: [{type: ArgType.None}],
        run: run,
    }
);
