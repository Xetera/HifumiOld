import {Guild, PermissionResolvable, RichEmbed} from "discord.js";
import ReactionManager from "../../handlers/internal/reactions/reactionManager";
import { random} from "../../utility/Util";

export default async function missingSelfPermission(guild: Guild, permission: PermissionResolvable | PermissionResolvable[]){
    let permissions: string;
    if (Array.isArray(permission)) {
        // @ts-ignore
       const permArray: string[] = permission.map((p: PermissionResolvable) => '`' + p + '`');
       permissions = permArray.join(' ');
    } else {
        permissions = '`' + permission + '`';
    }
    const embed = new RichEmbed()
        .setTitle(`But how?`)
        .setColor(`#ffbeb8`)
        .setDescription(
            `I need these permissions for that command: ${permissions}`
        );
    if (await ReactionManager.canSendReactions(guild.id)){
        embed.setThumbnail(random(ReactionManager.getInstance().shy))
    }
    return embed;

}
