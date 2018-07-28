 import {Channel, RichEmbed, TextChannel} from "discord.js";
import {random} from "../../utility/Util";
 import {IDatabase} from "../../interfaces/injectables/datbase.interface";
 import {Container} from "typescript-ioc";
 import {IReactionManager} from "../../interfaces/injectables/reactionManager.interface";

export async function handleFailedCommand(channel: Channel, message: string, footer?: string){
    const database: IDatabase = Container.get(IDatabase);
    const rm: IReactionManager = Container.get(IReactionManager);
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
        if (await database.getGuildColumn(channel.guild.id, 'reactions'))
            embed.setThumbnail(random(rm.shocked.concat(rm.shy)));
        channel.send(embed);
    }
}
