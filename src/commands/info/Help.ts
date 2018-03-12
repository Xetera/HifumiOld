import * as Discord from 'discord.js'
import {Database} from "../../database/Database";
const help = require('../help.json');

export function getHelp(message : Discord.Message, args : string[],  database : Database) {
    const prefixLine : string = `.prefix: ${database.getPrefix(message.guild.id)}\n`;
    let lines : string = prefixLine;
    const command = args[0];
    let commands : string[] = [];

    for (let i in help){
        commands.push(help[i].name);
    }
    if (!args.length){
        for (let i in help){
            lines += `.${help[i].name}: ${help[i].info}\n`
        }
        lines += "\nuse {help (command)} to get more information about commands.";
    }
    else if (args.length && commands.includes(command)){
        lines +=
            `.${help[command].name}: ${help[command].info}\n` +
            `.Usage: ${help[command].usage}\n` +
            `.Example: ${help[command].example}`;
    }
    else {
        return message.channel.send(args[0] + ' is not a valid command.');
    }
    message.channel.send('\`\`\`css\n' + lines + '\`\`\`');

}