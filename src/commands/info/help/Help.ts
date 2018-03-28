import * as Discord from 'discord.js'
import {Database} from "../../../database/Database";
import {Command, Help} from "./interface";
import {Message, RichEmbed} from "discord.js";
import {handleInvalidParameters} from "../../../handlers/commands/invalidCommandHandler";
import commandNotFoundEmbed from "../../../embeds/commands/commandNotFoundEmbed";
import {highlight} from "../../../utility/Markdown";
import {capitalize} from "../../../utility/Util";
const help = require('../../help.json');

export function getHelp(message : Message, args : string[],  database : Database) {
    const prefix: string = database.getPrefix(message.guild.id);
    if (!args.length){
        const prefix : string = database.getPrefix(message.guild.id);
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
            console.log(key);
            const command = sortedCommands[key].map((cmd: Command)=> '\`' + cmd.name + '\`').join(' ');
            embed.addField(sortedCommands[key][0].type, command);
        }


        embed.setTitle(`__Commands__`)
            .setColor('#FFE5B4')
            .setFooter(`${prefix}help {command} for more info`);
        message.channel.send(embed);
        return;
    }
    // searching specific command
    getSpecificHelp(message, args[0], prefix);

}

function getSpecificHelp(message: Message, arg: string, prefix: string){
    const command: Command = help.commands.find((command: Command)=> command.name === arg);
    if (!command)
        return message.channel.send(commandNotFoundEmbed(message.channel, arg));
    let embed = new RichEmbed().setTitle(capitalize(command.name))
        .setColor('#FFE5B4')
        .addField('Info', command.info)
        .addField('Usage', highlight(prefix + command.usage), true)
        .addField('Arguments', command.arguments, true)
        .addField('Example', highlight(prefix + command.example))
        .addField('Permissions', command.permissions ? command.permissions : 'Everyone', true)
        .addField('Type', command.type, true);
    message.channel.send(embed);
}