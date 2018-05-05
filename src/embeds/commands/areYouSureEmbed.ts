import {Guild, RichEmbed} from "discord.js";
import ReactionManager from "../../handlers/internal/reactions/reactionManager";
import {random} from "../../utility/Util";

export default async function areYouSureEmbed(q: string, expiration: number, guild: Guild){
    const embed = new RichEmbed()
        .addField(`Are you sure about that?`, q)
        .setFooter(`Respond with 'y' or n', this expires after ${expiration} seconds.`);
    if (await ReactionManager.canSendReactions(guild.id)){
        embed.setThumbnail(random(ReactionManager.getInstance().sorry))
    }
    return embed;
}
