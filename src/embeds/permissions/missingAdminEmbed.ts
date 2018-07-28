import {Guild, RichEmbed} from "discord.js";
import ReactionManager from "../../handlers/internal/reactions/reactionManager";
import {missingPermissionsEmbedColor} from "../../utility/Settings";
import gb from "../../misc/Globals";

export default async function missingAdminEmbed(guild: Guild): Promise<RichEmbed> {
    const embed = new RichEmbed()
        .setTitle(`Admin Command`)
        .setDescription(`I was told to only let admins use that, sorry...`)
        .setColor(missingPermissionsEmbedColor);

    if (await gb.instance.database.getReactions(guild.id)){
        embed.setThumbnail(ReactionManager.getInstance().sorry[0])
    }
    return embed;

}
