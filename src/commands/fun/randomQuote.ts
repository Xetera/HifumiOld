import {Message} from "discord.js";
import axios, {AxiosResponse} from 'axios'
import randomQuoteEmbed from "../../embeds/commands/fun/randomQuoteEmbed";

export interface IRandomQuote {
    quote: string;
    author: string;
    cat: string;
}

export default function randomQuote(message: Message){
    axios.get('https://talaikis.com/api/quotes/random/').then((r: AxiosResponse<IRandomQuote>) => {
        message.channel.send(randomQuoteEmbed(r.data));
    });
}
