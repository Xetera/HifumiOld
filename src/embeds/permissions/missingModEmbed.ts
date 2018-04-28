import {Guild, RichEmbed} from "discord.js";
import gb from "../../misc/Globals";
import {missingPermissionsEmbedColor} from "../../utility/Settings";
import ReactionManager from "../../handlers/reactions/reactionManager";

export default async function missingModEmbed(guild: Guild): Promise<RichEmbed>{
    const embed =  new RichEmbed()
        .setTitle(`Mod Command`)
        .setDescription(`Nice try, that was super adorable.`)
        .setColor(missingPermissionsEmbedColor);
    if (await gb.instance.database.getReactions(guild.id)){
        embed.setThumbnail(ReactionManager.getInstance().giggle);
    }
    return embed;
}
