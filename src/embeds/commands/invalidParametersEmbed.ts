import {highlight} from "../../utility/Markdown";
import {Channel, RichEmbed, TextChannel} from "discord.js";
import {random} from "../../utility/Util";
import gb from "../../misc/Globals";
import ReactionManager from "../../handlers/internal/reactions/reactionManager";
import {Command} from "../../commands/info/help/help.interface";
import {warningEmbedColor} from "../../utility/Settings";

export default async function invalidParametersEmbed(prefix: string, command: Command, channel: Channel){
    const rm = ReactionManager.getInstance();
    let embed = new RichEmbed()
        .setColor(warningEmbedColor)
        .setTitle(`What? huh?? I don't think you used that correctly...`)
        .setDescription(`**${prefix}${command.name}** needs **${command.arguments}** pieces of information.️`)
        .addField(`Usage`, highlight(prefix + command.usage!))
        .addField(`Example`, highlight(prefix + command.example!))
        .setFooter(`=> ${prefix}help ${command.name} <= for more info`);
    if (channel instanceof TextChannel && await gb.instance.database.getReactions(channel.guild.id)){
        embed.setThumbnail(random(rm.sorry.concat(rm.shy)));
    }
    return embed;
}
