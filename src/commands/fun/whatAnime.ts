import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import gb from "../../misc/Globals";
import Anime from "../../API/anime";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {random, StringUtils} from "../../utility/Util";
import {urlRegex} from "../../listeners/Regex";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {animePlaceholders} from "./getAnime";
import safeDeleteMessage from "../../handlers/safe/SafeDeleteMessage";

async function run(message: Message, input: [string]): Promise<any> {
    let [url] = input;
    if (url === 'last'){
        const messages = await message.channel.fetchMessages({limit: 10});
        const messageArray = messages.array().reverse();
        for (const sent of messageArray){
            let match = sent.content.match(urlRegex);
            if (match){
                url = match[0];
            }
        }
        if (url === 'last'){
            return handleFailedCommand(message.channel,
                `Couldn't find a link or attachment in the last 10 messages in this channel.`);
        }
    }
    const placeholder = <Message> await safeSendMessage(message.channel, random(animePlaceholders) + '\n_This might take a few seconds_');
    const out = await Anime.getInstance().reverseSearch(url);
    if (!out){
        return placeholder.edit("Whoops, couldn't find that anime");
    }
    // can't spread here.. for some weird reason
    await placeholder.edit(out[0]);
    await message.channel.send(out[1]);
}

export const command: Command = new Command(
    {
        names: ['whatanime', 'searchanime'],
        info:
        'Searches an image to try to find its name. Use "last" to search the last image sent in the channel.\n' +
        'Full screenshots will give the best results' ,
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
