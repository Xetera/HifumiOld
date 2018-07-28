import {Guild, RichEmbed} from "discord.js";
import {advertiseOnBan} from "../../interfaces/Replies";
import ReactionManager from "../../handlers/internal/reactions/reactionManager";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";
import {IReactionManager} from "../../interfaces/injectables/reactionManager.interface";

export default async function inviteSpamBanEmbed(guild: Guild): Promise<RichEmbed>{
    const database: IDatabase = Container.get(IDatabase)
    const rm = Container.get(IReactionManager);
    // for now we don't need this to be a variable amount but maybe
    // later some guilds may want to ban on different amount of invites
    const strikeLimit = await database.getGuildColumn(guild.id, 'invite_ban_threshold');
    return new RichEmbed()
        .setTitle(`Banned ⛔`)
        .setColor('#FF0000')
        .setThumbnail(guild.iconURL)
        .setDescription(`You were banned from **${guild.name}** for posting ${strikeLimit} invites, advertising is not allowed, sorry.\n\n${advertiseOnBan()}`)
        .setImage(rm.turn)
        .setTimestamp()
}
