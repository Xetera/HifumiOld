import {Message, RichEmbed} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import EmbedBuilder from "../../handlers/internal/embedBuilder";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

async function run(message: Message, input: [string]): Promise<any> {
    const embed: RichEmbed | void = await EmbedBuilder.getInstance().embed(message, input);
    if (embed){
        safeSendMessage(message.channel, embed);
    }
}

export const command: Command = new Command(
    {
        names: ['embed'],
        info: 'Sends an embed to the channel',
        usage: '{{prefix}}embed { template }',
        examples: [
            '{{prefix}}embed\n' +
            '%title% Rules\n' +
            '%description% Here are the rules!\n' +
            '%field1% No spamming\n' +
            '%value1% Thanks\n' +
            '%color% red\n' +
            '%footer% boi'
        ],
        category: 'Embeds',
        expects: [{type: ArgType.Message}],
        run: run,
    }
);
