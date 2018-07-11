import {Message} from "discord.js";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import pingEmbed from "../../embeds/commands/pingEmbed";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";

async function run(message: Message): Promise<any> {
    return safeSendMessage(message.channel, pingEmbed());
}

export const command: Command = new Command(
    {
        names: ['ping'],
        info: 'Gets latency to Discord.',
        usage: '{{prefix}}ping',
        examples: ['{{prefix}}ping'],
        category: 'Info',
        expects: [{type: ArgType.None}],
        run: run,
    }
);
