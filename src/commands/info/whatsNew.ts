import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {Message} from "discord.js";
import whatsNewEmbed from "../../embeds/commands/info/whatsNewEmbed";
import {parsePatchNotes} from "../../parsers/parsePatchNotes";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";



async function run(message: Message): Promise<any> {
    const [fname, content] = await parsePatchNotes();
    const embed = whatsNewEmbed(fname, content);
    safeSendMessage(message.channel, embed);
}

export const command: Command = new Command({
    names: ['whatsnew', 'patchnotes'],
    info: 'Displays what changed in my most recent update',
    usage: '{{prefix}}whatsnew',
    examples: ['{{prefix}}whatsnew'],
    expects: [{type: ArgType.None}],
    category: 'Info',
    run: run
});
