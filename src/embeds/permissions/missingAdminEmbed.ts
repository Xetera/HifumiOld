import {Guild, RichEmbed} from "discord.js";
import ReactionManager from "../../handlers/internal/reactions/reactionManager";
import {Container} from "typescript-ioc";
import {missingPermissionsEmbedColor} from "../../utility/Settings";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";

export default async function missingAdminEmbed(guild: Guild): Promise<RichEmbed> {
    const database: IDatabase = Container.get(IDatabase)
    const embed = new RichEmbed()
        .setTitle(`Admin Command`)
        .setDescription(`I was told to only let admins use that, sorry...`)
        .setColor(missingPermissionsEmbedColor);

    if (await database.getGuildColumn(guild.id, 'reactions')){
        embed.setThumbnail(ReactionManager.getInstance().sorry[0])
    }
    return embed;

}
