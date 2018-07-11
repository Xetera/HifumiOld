import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import axios from 'axios'
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import catEmbed from "../../embeds/commands/fun/catEmbed";

async function run(message: Message): Promise<any> {
    let response;
    try {
        response = await axios.get('http://aws.random.cat/meow');
    } catch (err) {
        if (err.response.status !== 200) {
            return void handleFailedCommand(message.channel,
                `Failed to get kitties, they probably need time to get ready.`,
                `The cat website tends to get spammed a lot so they don't always let you request images.`
            );
        }
        return void handleFailedCommand(message.channel, `Something happened that I wasn't expecting... yikes!`);
    }
    safeSendMessage(message.channel, catEmbed(response.data.file));
}

export const command: Command = new Command(
    {
        names: ['kitty', 'cat'],
        info: 'Sends a cute cat.',
        usage: '{{prefix}}cat',
        examples: ['{{prefix}}cat'],
        category: 'Fun',
        expects: [{type: ArgType.None}],
        run: run
    }
);
