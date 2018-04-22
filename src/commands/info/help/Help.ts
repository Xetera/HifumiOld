import * as Discord from 'discord.js'
import {Database} from "../../../database/Database";
import {Command, Help} from "./interface";
import {Message, RichEmbed} from "discord.js";
import {handleInvalidParameters} from "../../../handlers/commands/invalidCommandHandler";
import commandNotFoundEmbed from "../../../embeds/commands/commandNotFoundEmbed";
import {highlight} from "../../../utility/Markdown";
import {capitalize} from "../../../utility/Util";
import {commandEmbedColor} from "../../../utility/Settings";
import gb from "../../../misc/Globals";
import {ICachedMacro, IMacro} from "../../../database/TableTypes";
import helpMacroEmbed from "../../../embeds/commands/helpMacroEmbed";
const help = require('../../help.json');

export async function getHelp(message : Message, args : string[]) {
    const prefix: string = await gb.instance.database.getPrefix(message.guild.id);
    if (!args.length){
        const prefix : string = await gb.instance.database.getPrefix(message.guild.id);
        let embed = new RichEmbed().addField("Your prefix", prefix, true);

        const sortedCommands = help.commands.reduce((obj: {[type:string]: Command[]}, command: Command) => {
            if (!obj[command.type]){
                obj[command.type] = [];
            }
            obj[command.type].push(command);
            return obj;
        }, {});
        // this may be a little
        for(let key in sortedCommands){
            const command = sortedCommands[key].map((cmd: Command)=> '\`' + cmd.name + '\`').join(', ');
            embed.addField(sortedCommands[key][0].type, command);
        }

        embed.setTitle(`__Commands__`)
            .setColor(commandEmbedColor)
            .setFooter(`${prefix}help {command} for more info`);
        message.channel.send(embed);
        return;
    }
    // searching specific command
    getSpecificHelp(message, args[0], prefix);
}

async function getSpecificHelp(message: Message, arg: string, prefix: string){
    const command: Command = help.commands.find((command: Command)=> command.name === arg);
    if (!command) {
        const macro = await gb.instance.database.getMacro(message.guild.id, arg);
        if (macro){
            return message.channel.send(helpMacroEmbed(message.guild, macro));
        }
        return message.channel.send(commandNotFoundEmbed(message.channel, arg));
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
