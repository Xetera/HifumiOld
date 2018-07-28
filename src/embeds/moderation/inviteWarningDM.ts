import {Guild, RichEmbed} from "discord.js";
import {warningEmbedColor} from "../../utility/Settings";
import ReactionManager from "../../handlers/internal/reactions/reactionManager";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";
import {IReactionManager} from "../../interfaces/injectables/reactionManager.interface";

export default async function inviteWarningDMEmbed(guild: Guild): Promise<RichEmbed> {
    // for now we don't need this to be a variable amount but maybe
    // later some guilds may want to ban on different amount of invites
    // Done ^
    const database: IDatabase = Container.get(IDatabase)

    const rm = Container.get(IReactionManager);
    const current = await  database.getGuildColumn(guild.id, 'invite_warn_threshold');
    const max = await database.getGuildColumn(guild.id, 'invite_ban_threshold')
    const embed = new RichEmbed()
        .setTitle(`Invite Warning`)
        .setColor(warningEmbedColor)
        .setThumbnail(guild.iconURL)
        .setDescription(`You've sent ${current} invites in **${guild.name}** where advertising is __not__ allowed, you will get banned at ${max} invites. This is your one and only warning.`)
        .setTimestamp();

    if (await rm.canSendReactions(guild.id)){
        embed.setImage(rm.stare);
    }
    return embed;
}
