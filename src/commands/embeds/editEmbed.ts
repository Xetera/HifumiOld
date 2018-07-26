import {Message, RichEmbed} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import EmbedBuilder from "../../handlers/internal/embedBuilder";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

async function run(message: Message): Promise<any> {
    const embed: RichEmbed | void = await EmbedBuilder.getInstance().editEmbed(message);
    if (embed){
        safeSendMessage(message.channel, embed);
    }
}

export const command: Command = new Command(
    {
        names: ['editembed', 'ee'],
        info: 'Edits your current embed, only replacing given portions',
        usage: '{{prefix}}editembed { template }',
        examples: [
            '{{prefix}}editembed' +
            '%footer% boi'
        ],
        category: 'Embeds',
        expects: [{type: ArgType.Message}],
        run: run,
    }
);

