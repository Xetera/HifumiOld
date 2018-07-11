import {Guild, PermissionResolvable, RichEmbed} from "discord.js";
import ReactionManager from "../../handlers/internal/reactions/reactionManager";
import {normalizeString, random} from "../../utility/Util";

export default async function missingSelfPermission(guild: Guild, permission: PermissionResolvable | PermissionResolvable[]){
    const embed = new RichEmbed()
        .setTitle(`But how?`)
        .setColor(`#ffbeb8`)
        .setDescription(
            `I need these permissions for that command:\n` +
            `${Array.isArray(permission) ? permission.map(p => `\`${p}\``).join('\n') : `\`${permission}\``}`
        );
    if (await ReactionManager.canSendReactions(guild.id)){
        embed.setThumbnail(random(ReactionManager.getInstance().shy))
    }
    return embed;

}
