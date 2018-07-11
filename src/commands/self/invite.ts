import {Message} from "discord.js";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import inviteEmbed from "../../embeds/commands/inviteEmbed";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";

async function run(message: Message): Promise<any> {
    safeSendMessage(message.channel, inviteEmbed());
}

export const command: Command = new Command(
    {
        names: ['invite'],
        info: 'Sends an invite link for inviting me or joining my support server.',
        usage: '{{prefix}}invite',
        examples: ['{{prefix}}invite'],
        category: 'Info',
        expects: [{type: ArgType.None}],
        run: run
    }
);
