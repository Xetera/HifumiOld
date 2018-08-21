import {Guild, RichEmbed} from "discord.js";
import {random} from "../../utility/Util";
import {canSendReactions, sorry} from "../../handlers/internal/reactions/reactionManager";

export default async function areYouSureEmbed(q: string, expiration: number, guild: Guild){
    const embed = new RichEmbed()
        .addField(`Are you sure about that?`, q)
        .setColor('#ddc1ff')
        .setFooter(`Respond with 'y' or n', this expires after ${expiration} seconds.`);
    if (await canSendReactions(guild.id)){
        embed.setThumbnail(random(sorry))
    }
    return embed;
}
