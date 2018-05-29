import {Channel, PermissionResolvable, RichEmbed} from "discord.js";
import gb from "../../misc/Globals";
import {missingPermissionsEmbedColor} from "../../utility/Settings";

export default function missingPermissionsEmbed(channel: Channel, permission: PermissionResolvable[], sendMessageError?: boolean): RichEmbed{

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
