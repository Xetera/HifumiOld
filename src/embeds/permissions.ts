import {Channel, Guild, PermissionResolvable, RichEmbed} from "discord.js";
import {random} from "../utility/Util";
import {missingPermissionsEmbedColor} from "../utility/Settings";
import {gb} from "../misc/Globals";
import {canSendReactions, giggle, shy, sorry} from "../handlers/internal/reactions/reactionManager";

export async function missingAdminEmbed(guild: Guild): Promise<RichEmbed> {
    const embed = new RichEmbed()
        .setTitle(`Admin Command`)
        .setDescription(`I was told to only let admins use that, sorry...`)
        .setColor(missingPermissionsEmbedColor);

    if (await gb.database.getReactions(guild.id)){
        embed.setThumbnail(sorry[0])
    }
    return embed;

}

export function missingGuildOwnerEmbed(guild: Guild): RichEmbed {
    return new RichEmbed()
        .setTitle(`Nice try`)
        .setDescription(`This command is only available to ${guild.owner}.`)
        .setColor('#ff0000');
}
export async function missingModEmbed(guild: Guild): Promise<RichEmbed>{
    const embed =  new RichEmbed()
        .setTitle(`Mod Command`)
        .setDescription(`Nice try, that was super adorable.`)
        .setColor(missingPermissionsEmbedColor);
    if (await gb.database.getReactions(guild.id)){
        embed.setThumbnail(giggle);
    }
    return embed;
}
export function missingPermissionsEmbed(channel: Channel, permission: PermissionResolvable[], sendMessageError?: boolean): RichEmbed{

    let missingPermissions: string = '';
    if (permission.includes('EMBED_LINKS')){
        missingPermissions += '> \`Embed Links\`\n'
    }
    if (permission.includes('SEND_MESSAGES')){
        missingPermissions += '> \`Send Messages\`'
    }

    return new RichEmbed()
        .setTitle(`Missing Permissions ✏️`)
        .setDescription(`I'm gonna need more permissions to be able to do that` + (sendMessageError ? ` in ${channel}.` : '.'))
        .addField(
            `Missing`, missingPermissions !== ''
                ? missingPermissions
                : permission.map(perm => '`' + perm + '`').join(', '))
        .setColor(missingPermissionsEmbedColor)
}
export async function missingSelfPermission(guild: Guild, permission: PermissionResolvable | PermissionResolvable[]){
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
    if (await canSendReactions(guild.id)){
        embed.setThumbnail(random(shy))
    }
    return embed;

}
