import {Channel, RichEmbed, TextChannel} from "discord.js";
import lavenshteinDistance from "../../utility/LavenshteinDistance";
import {Help} from "../../commands/info/help/interface";
const help: Help = require('../../commands/help.json');

export default function commandNotFoundEmbed(channel : Channel, commandName: string, pool?: string[]){
    if (pool){
        pool = help.commands.map(c => c.name).concat(pool)
    }
    else {
        pool = help.commands.map(c => c.name);
    }
    let suggestion: string = lavenshteinDistance(commandName, pool);
    return new RichEmbed()
        .setTitle(`Invalid Command...`)
        .setColor('#ffdd51')
        .setDescription(`I don't know what **${commandName}** is, perhaps you meant ${
            suggestion === 'to spam me like some kind of dummy' ? suggestion : '**' + suggestion  + '**'
        }?`);
}
