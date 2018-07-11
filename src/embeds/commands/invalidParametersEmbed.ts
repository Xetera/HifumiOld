import {highlight} from "../../utility/Markdown";
import {Channel, RichEmbed, TextChannel} from "discord.js";
import {pluralize, random} from "../../utility/Util";
import gb from "../../misc/Globals";
import ReactionManager from "../../handlers/internal/reactions/reactionManager";
import {warningEmbedColor} from "../../utility/Settings";
import {Command} from "../../handlers/commands/Command";

export default async function invalidParametersEmbed(prefix: string, command: Command, channel: Channel){
    const rm = ReactionManager.getInstance();
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

    if (channel instanceof TextChannel && await gb.instance.database.getReactions(channel.guild.id)){
        embed.setThumbnail(random(rm.sorry.concat(rm.shy)));
    }
    return embed;
}
