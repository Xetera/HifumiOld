import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import botInfoEmbed from "../../embeds/commands/info/botInfoEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

async function run(message: Message): Promise<any> {
    safeSendMessage(message.channel, botInfoEmbed(message));
}

export const command: Command = new Command(
    {
        names: ['botinfo'],
        info: 'Fetches information about the bot.',
        usage: '{{prefix}}botinfo',
        examples: ['{{prefix}}botinfo'],
        category: 'Info',
        expects: [{type: ArgType.None}],
        run: run
    }
);
