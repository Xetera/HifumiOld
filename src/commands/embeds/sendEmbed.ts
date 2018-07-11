import {Channel, Message, RichEmbed} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import EmbedBuilder from "../../handlers/internal/embedBuilder";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import gb from "../../misc/Globals";

async function run(message: Message, input: [(Channel | undefined)]): Promise<any> {
    const [channel] = input;
    const embed: RichEmbed | void = await EmbedBuilder.getInstance().getEmbed(message);
    if (embed){
        return safeSendMessage(channel || message.channel, embed);
    }
    const prefix = await gb.instance.database.getPrefix(message.guild.id);
    return await handleFailedCommand(
        message.channel, `You haven't created an embed yet! use ${prefix}embed to build one!`
    );
}

export const command: Command = new Command(
    {
        names: ['sendembed', 'se'],
        info: 'Sends the current saved embed to the current or a specified channel.',
        usage: '{{prefix}}sendembed { channel? }',
        examples: ['{{prefix}}sendembed', '{{prefix}}sendembed #rules'],
        category: 'Embeds',
        expects: [{type: ArgType.Channel, options: {optional: true}}],
        run: run
    }
);
