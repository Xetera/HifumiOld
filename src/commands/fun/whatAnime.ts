import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import gb from "../../misc/Globals";
import Anime from "../../API/anime";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {StringUtils} from "../../utility/Util";
import {urlRegex} from "../../listeners/Regex";

async function run(message: Message, input: [string]): Promise<any> {
    let [url] = input;
    if (url === 'last'){
        const messages = await message.channel.fetchMessages({limit: 10});
        const messageArray = messages.array();
        for (const sent of messageArray){
            let match = sent.content.match(urlRegex);
            if (match){
                url = match[0];
            }
        }
    }
    const out = await Anime.getInstance().reverseSearch(url);
    if (!out){
        return safeSendMessage(message.channel, "Whoops, couldn't find that anime");
    }
    safeSendMessage(message.channel, out);
}

export const command: Command = new Command(
    {
        names: ['whatanime', 'searchanime'],
        info: 'Searches an image to try to find its name. Use "last" to search the last image sent in the channel.',
        usage: "{{prefix}}whatanime { url | 'last' }",
        examples: [
            '{{prefix}}whatanime https://cdn.hifumi.io/xetera/0XvWlGkkX.jpg',
            '{{prefix}}whatanime last'
        ],
        category: 'Fun',
        expects: [{type: ArgType.String}],
        run: run,
    }
);
