import * as Discord from 'discord.js'
import {Database} from "../../../database/Database";
import {Command, Help} from "./help.interface";
import {Message, RichEmbed} from "discord.js";
import {handleInvalidParameters} from "../../../handlers/commands/invalidCommandHandler";
import commandNotFoundEmbed from "../../../embeds/commands/commandNotFoundEmbed";
import {highlight} from "../../../utility/Markdown";
import {capitalize, random} from "../../../utility/Util";
import {commandEmbedColor} from "../../../utility/Settings";
import gb from "../../../misc/Globals";
import helpMacroEmbed from "../../../embeds/commands/helpMacroEmbed";
const help = require('../../help.json');

export async function getHelp(message : Message, input: [string] | undefined) {
    const choice = Array.isArray(input) ? input.shift() : undefined;
    const prefix: string = await gb.instance.database.getPrefix(message.guild.id);
    if (!choice){
        const prefix : string = await gb.instance.database.getPrefix(message.guild.id);
        let embed = new RichEmbed();

        let sortedCommands: {[type:string]: Command[]} = help.commands.reduce((obj: {[type:string]: Command[]}, command: Command) => {
            if (!obj[command.type]){
                obj[command.type] = [];
            }
            obj[command.type].push(command);
            return obj;
        }, {});
        // this may be a little

        for(let key in sortedCommands){
            // sorting alphabetically
            sortedCommands[key] = sortedCommands[key].sort(function(a, b){
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });

            const command = sortedCommands[key].map((cmd: Command)=> '`' + prefix + cmd.name + '`').join(', ');
            embed.addField('⇨ ' + sortedCommands[key][0].type + ' ⇦', command);
        }
        const randomCategory = sortedCommands[random(Object.keys(sortedCommands))];
        embed.setTitle(`__Commands__`)
            .setDescription(`I auto delete messages starting with 2 of your prefixes like so \`${prefix + prefix}${randomCategory[random(Object.keys(randomCategory))].name}\`\n`)
            .setColor(commandEmbedColor)
            .setFooter(`${prefix}help {command} for more info`);
        message.channel.send(embed);
        return;
    }
    // searching specific command
    getSpecificHelp(message, choice, prefix);
}

async function getSpecificHelp(message: Message, arg: string, prefix: string){
    const command: Command = help.commands.find((command: Command)=> command.name === arg);
    if (!command) {
        const macro = await gb.instance.database.getMacro(message.guild.id, arg);
        if (macro){
            return message.channel.send(helpMacroEmbed(message.guild, macro));
        }
        return message.channel.send(await commandNotFoundEmbed(message.channel, arg));
    }
    const shortCommand: boolean = command.usage === command.example;
    let embed = new RichEmbed()
        .setTitle('__' + command.name + '__')
        .setColor(commandEmbedColor)
        .addField('Info', command.info)
        .addField('Usage', highlight(prefix + command.usage))
        .addField('Example', highlight(prefix + command.example))
        .addField('Permissions', command.permissions ? command.permissions : 'Everyone', true)
        .addField('Arguments', command.arguments, true)
        .addField('Type', command.type, true);
    message.channel.send(embed);
}
