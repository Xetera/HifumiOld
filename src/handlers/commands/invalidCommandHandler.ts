import {Channel, RichEmbed, TextChannel} from "discord.js";
import {debug} from '../../utility/Logging'
import {random, sanitizeUserInput} from "../../utility/Util";
import findCommand from "../../commands/info/help/findCommand";
import gb from "../../misc/Globals";
import ReactionManager from "../reactions/reactionManager";

export async function handleInvalidParameters(channel : Channel, commandName: string){
    const command = findCommand(commandName);

    if (!(channel instanceof TextChannel)){
        return;
    }

    if (!command){
        debug.error(`Could not find command ${commandName}`, 'handleInvalidParameters');
        return;
    }
    else if (!command.arguments) {
        debug.error(`An uncallable command was referenced`, 'handleInvalidParameters');
        return;
    }

    let embed = new RichEmbed()
        .setColor('#ffdd51')
        .setTitle(`Yikes, that's not how you do that! ⚠`)
        .setDescription(`${command.name} takes **${command.arguments}** arguments.️`)
        .addField(`Usage`, command.usage)
        .addField(`Example`, command.example)
        .setFooter(`${await gb.instance.database.getPrefix(channel.guild.id)}${command.name} for more info`);
    if (await gb.instance.database.getReactions(channel.guild.id)){
        embed.setThumbnail(random(ReactionManager.getInstance().sorry));
    }
    channel.send(embed);
}
