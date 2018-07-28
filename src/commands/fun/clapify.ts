import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {debug} from "../../utility/Logging";

async function run(message: Message, input: [string]): Promise<any> {

    const [content] = input;
    const words = content.split(' ');
    const edited = words.reduce((coll: string[], item: string, index: number) => {
        coll.push(item);
        if (index !== words.length - 1) {
            coll.push('👏');
        }
        return coll;
    }, []);
    const out = edited.join(' ');
    try {
        message.channel.send(out, {disableEveryone: true});
    } catch (e) {
        debug.error(e, `Clapify`);
        handleFailedCommand(message.channel,
             `Couldn't send that message`
        );
    }
}

export const command: Command = new Command(
    {
        names: ['clapify'],
        info: 'Clapifies your message',
        usage: '{{prefix}}clapify { message }',
        examples: ['{{prefix}}clapify no running in the halls'],
        category: 'Fun',
        expects: [{type: ArgType.Message}],
        run: run
    }
);
