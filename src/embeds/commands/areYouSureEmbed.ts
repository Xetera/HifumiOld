import {Guild, RichEmbed} from "discord.js";
import {random} from "../../utility/Util";
import {IReactionManager} from "../../interfaces/injectables/reactionManager.interface";
import {Container} from "typescript-ioc";

export default async function areYouSureEmbed(q: string, expiration: number, guild: Guild){
    const rm: IReactionManager = Container.get(IReactionManager);
    const embed = new RichEmbed()
        .addField(`Are you sure about that?`, q)
        .setColor('#ddc1ff')
        .setFooter(`Respond with 'y' or n', this expires after ${expiration} seconds.`);
    if (await rm.canSendReactions(guild.id)){
        embed.setThumbnail(random(rm.sorry))
    }
    return embed;
}
