import {Message, PermissionString} from "discord.js";
import gb from "../misc/Globals";

import missingAdminEmbed from "../embeds/permissions/missingAdminEmbed";

export default function onlyAdmin(target : any, key: any , descriptor: any) {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
        const message : Message = arguments[0].message;
        if (!message.member.permissions.has('ADMINISTRATOR') && message.author.id !== gb.ownerID){
            message.channel.send(
                missingAdminEmbed(message.guild)
            );
            return;
        }

        return originalMethod.apply(this, arguments);
    };

    if (descriptor.value != null)
        return descriptor;
}
