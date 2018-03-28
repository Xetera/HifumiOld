import {Channel, RichEmbed, TextChannel} from "discord.js";
import {debug} from '../../utility/Logging'
import findCommand from "../../commands/info/help/findCommand";

export function handleInvalidParameters(channel : Channel, commandName: string){
    const command = findCommand(commandName)!;
    if (!command){
        debug.error(`Could not find command ${commandName}`, 'handleInvalidParameters');
    }
    else if (!command.arguments) {
        debug.error(`An uncallable command was referenced`, 'handleInvalidParameters');
    }
    let embed = new RichEmbed()
        .setColor('#ffdd51')
        .setTitle(`Yikes, that's not how you do that!`)
        .setDescription(`⚠️ ${command.name} takes **${command.arguments}** arguments. ⚠️`)
        .addField(`Usage`, command.usage)
        .addField(`Example`, command.example);
    if (channel instanceof TextChannel)
        channel.send(embed);
}