import {Channel, RichEmbed, TextChannel} from "discord.js";
import gb from "../../misc/Globals";
import {random} from "../../utility/Util";
import ReactionManager from "../../handlers/reactions/reactionManager";
import {warningEmbedColor} from "../../utility/Settings";

export async function handleFailedCommand(channel: Channel, message: string, footer?: string){
    // we don't want @everyone pings going off because of this
    const out = message.replace('@', '\`@\`');

    let embed = new RichEmbed()
        .setColor('#ff0000')
        .setTitle(`Something went wrong!`)
        .setDescription(out);
    if (out.indexOf('`@`everyone') >= 0){
        // in case we're
        embed.setFooter(`Nice try btw`)
    }
    if (footer){
        embed.setFooter(footer);
    }
    if (channel instanceof TextChannel){
        if (await gb.instance.database.getReactions(channel.guild.id))
            embed.setThumbnail(random(ReactionManager.getInstance().shocked));
        channel.send(embed);
    }
}
