import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import Anime from "../../API/anime";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import { getUrlExtension, StringUtils} from "../../utility/Util";
import {urlRegex} from "../../listeners/Regex";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import whatAnimePlaceholder from "../../embeds/commands/fun/anime/whatAnimePlaceholder";
import isUrl = StringUtils.isUrl;
import {AnimeUtils} from "../../utility/animeUtils";
import isPicture = AnimeUtils.isPicture;


async function run(message: Message, input: [string]): Promise<any> {
    let [url] = input;
    if (url === 'last') {
        const messageArray = await message.channel.fetchMessages({limit: 10});
        for (const sent of messageArray.array()) {
            const attachmentMatch = sent.attachments.array();

            const attachmentFile = attachmentMatch.find(item => urlRegex.test(item.url));
            const fileMatch = attachmentFile && attachmentFile.url.match(urlRegex);
            let match = sent.content.match(urlRegex);

            if (match && isPicture(match[0], true)) {
                url = match[0];
            }
            else if (fileMatch && isPicture(fileMatch[0], true)) {
                url = fileMatch[0]
            }
        }
        if (url === 'last') {
            return handleFailedCommand(message.channel,
                `Couldn't find a link or attachment in the last 10 messages in this channel.`);
        }
    }
    else if (url === 'last embed') {
        const messageArray = await message.channel.fetchMessages({limit: 10});
        for (const sent of messageArray.array()) {
            if (!sent.embeds.length) {
                continue;
            }
            for (const embed of sent.embeds) {
                if (embed && embed.image && embed.image.url && isPicture(embed.image.url, true)) {
                    url = embed.image.url;
                }
            }
        }
        if (url === 'last embed') {
            return handleFailedCommand(message.channel, `Could not find a matching embed in the last 10 messages`);
        }
    }
    else if (!isUrl(url)) {
        return handleFailedCommand(message.channel,
            `Expected **${url}** to be a URL, 'last' or 'last embed'`
        );
    }

    const isGif = getUrlExtension(url) === 'gif';
    const placeholder = <Message> await safeSendMessage(message.channel, whatAnimePlaceholder(message.member, url, isGif));
    const out = await Anime.getInstance().reverseSearch(url, isGif);

    if (typeof out[0] === 'string') {
        placeholder.delete();
        return handleFailedCommand(message.channel, <string> out[0]);
    }

    await placeholder.edit(out[0]);

    if (out[1]) {
        await message.channel.send(out[1]);
    }
}

export const command: Command = new Command(
    {
        names: ['whatanime', 'searchanime'],
        info:
        'Searches an image to try to find its name.\n' +
        'Use `last` to search the last image/attachment sent in the channel.\n' +
        'Use `last embed` to search for an embed containing an image.\n' +
        "This will **not** work with anything that's not an anime screenshot such as manga, art, doujin etc\n" +
        'Complete screenshots will give the best results',
        usage: "{{prefix}}whatanime { url | 'last' | 'last embed' }",
        examples: [
            '{{prefix}}whatanime https://cdn.hifumi.io/xetera/0XvWlGkkX.jpg',
            '{{prefix}}whatanime last'
        ],
        category: 'Fun',
        expects: [{type: ArgType.Message}],
        run: run,
        dependsOn: 'WHATANIME_KEY'
    }
);
