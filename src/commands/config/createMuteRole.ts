import {Message, Permissions, PermissionString, RichEmbed, Role} from "discord.js";
import missingPermissionsEmbed from "../../embeds/permissions/missingPermissionsEmbed";
import {APIErrors} from "../../interfaces/Errors";

export default function createMuteRole(message: Message): Promise<Role> {
    if (!message.guild.me.hasPermission('MANAGE_ROLES')){
        const embed = missingPermissionsEmbed(message.channel, ['MANAGE_ROLES']);
        message.channel.send(embed);
        return Promise.reject(APIErrors.MISSING_PERMISSIONS)
    }

    return message.guild.createRole({
        name: 'muted',
        color: '#7c6666',
        hoist: false,
        position: message.guild.roles.size - 1,
        permissions: ["READ_MESSAGE_HISTORY", "READ_MESSAGES"],
        // just to mess with them lol
        mentionable: true
    })
}
