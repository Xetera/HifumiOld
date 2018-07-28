import {highlight} from "../../utility/Markdown";
import {Channel, RichEmbed, TextChannel} from "discord.js";
import {pluralize, random} from "../../utility/Util";
import {warningEmbedColor} from "../../utility/Settings";
import {Command} from "../../handlers/commands/Command";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";
import {IReactionManager} from "../../interfaces/injectables/reactionManager.interface";

export default async function invalidParametersEmbed(prefix: string, command: Command, channel: Channel){
    const database: IDatabase = Container.get(IDatabase);
    const rm = Container.get(IReactionManager);
    const name = command.names[0];
    const firstUsage = command.getUsage(prefix);
    const example = command.getFirstExample(prefix);
    let embed = new RichEmbed()
        .setColor(warningEmbedColor)
        .setTitle(`What? huh?? I don't think you used that correctly...`)
        .setDescription(`**${prefix}${name}** needs **${command.argLength}** ${pluralize('piece', command.argLength)} of information.️`)
        .addField(`Usage`, highlight(firstUsage))
        .addField(`Example`, highlight(example))
        .setFooter(`=> ${prefix}help ${name} <= for more info`);

    if (channel instanceof TextChannel && await database.getGuildColumn(channel.guild.id, 'reactions')){
        embed.setThumbnail(random(rm.sorry.concat(rm.shy)));
    }
    return embed;
}
