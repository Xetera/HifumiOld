import {Channel, RichEmbed, TextChannel} from "discord.js";
import maybeYouMeant from "../../utility/LavenshteinDistance";

export default function commandNotFoundEmbed(channel : Channel, commandName: string){
    let suggestion: string = maybeYouMeant(commandName);
    return new RichEmbed()
        .setTitle(`Hmm not sure what command that is...`)
        .setColor('#ffdd51')
        .setDescription(`I don't know what \`${commandName}\` is, perhaps you meant ${
            suggestion === 'to spam me like some kind of dummy' ? suggestion : '\`' + suggestion  + '\`'
        }?`);
}