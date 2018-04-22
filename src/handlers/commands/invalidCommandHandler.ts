import {Channel, RichEmbed, TextChannel} from "discord.js";
import {debug} from '../../utility/Logging'
import {random, sanitizeUserInput} from "../../utility/Util";
import findCommand from "../../commands/info/help/findCommand";
import gb from "../../misc/Globals";
import ReactionManager from "../reactions/reactionManager";
import {highlight} from "../../utility/Markdown";

export async function handleInvalidParameters(channel : Channel, commandName: string){
    const command = findCommand(commandName);

    if (!(channel instanceof TextChannel)){
        return;
    }
    const prefix = await gb.instance.database.getPrefix(channel.guild.id);
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
        .setDescription(`**${prefix}${command.name}** takes **${command.arguments}** arguments.️`)
        .addField(`Usage`, highlight(prefix + command.usage!))
        .addField(`Example`, highlight(prefix + command.example!))
        .setFooter(`${prefix}${command.name} for more info`);
    if (await gb.instance.database.getReactions(channel.guild.id)){
        embed.setThumbnail(random(ReactionManager.getInstance().sorry));
    }
    channel.send(embed);
}
