import {IRandomQuote} from "../../../commands/fun/randomQuote";
import {RichEmbed} from "discord.js";

export default function randomQuoteEmbed(input: IRandomQuote){
    return new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`${input.quote}\n-**${input.author}**`)
}
