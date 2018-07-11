import axios from "axios";
import * as cheerio from "cheerio";
import {CHBaseEndpoint} from "../endpoints/CyanideAndHappinessEndpoints";
import {Message} from "discord.js";
import chEmbed from "../../embeds/commands/fun/chEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {randomRuntimeError} from "../../interfaces/Replies";
import {Command} from "../../handlers/commands/Command";
import {debug} from "../../utility/Logging";
import {ArgType} from "../../decorators/expects";


async function run(message: Message) {
    try {
        const res = await axios.get(CHBaseEndpoint);
        const $ = cheerio.load(res.data);
        const paths = res.request.path.split('/');

        const comicNumber: string = paths[paths.length - 2];
        const url: string = 'http:' + $('#main-comic').attr('src');

        const embed = chEmbed(comicNumber, url);
        safeSendMessage(message.channel, embed);
    }
    catch (err) {
        debug.error('There was an error fetching fetching CH comic\n', err);
        safeSendMessage(message.channel, randomRuntimeError());
    }
}

export const command = new Command(
    {
        names: ['ch', 'cyanide'],
        info: 'Sends a cyanide and happiness comic',
        usage: '{{prefix}}ch',
        examples: ['{{prefix}}ch'],
        category: 'Fun',
        expects: [{type: ArgType.None}],
        run: run
    }
);
