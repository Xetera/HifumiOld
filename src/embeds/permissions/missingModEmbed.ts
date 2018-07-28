import {Guild, RichEmbed} from "discord.js";
import {missingPermissionsEmbedColor} from "../../utility/Settings";
import ReactionManager from "../../handlers/internal/reactions/reactionManager";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";
export default async function missingModEmbed(guild: Guild): Promise<RichEmbed>{
    const database: IDatabase = Container.get(IDatabase)
    const embed =  new RichEmbed()
        .setTitle(`Mod Command`)
        .setDescription(`Nice try, that was super adorable.`)
        .setColor(missingPermissionsEmbedColor);
    if (await database.getGuildColumn(guild.id, 'reactions')){
        embed.setThumbnail(ReactionManager.getInstance().giggle);
    }
    return embed;
}
