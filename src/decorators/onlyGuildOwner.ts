import * as Discord from "discord.js";
import gb from "../misc/Globals";
import missingGuildOwnerEmbed from "../embeds/permissions/missingGuildOwnerEmbed";

export default function onlyGuildOwner(target : any, key: any , descriptor: any) {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
        const message : Discord.Message = arguments[0].message;
        if (message.member.id !== message.guild.ownerID && message.author.id !== gb.ownerID){
            message.channel.send(missingGuildOwnerEmbed(message.guild));
            return;
        }
        return originalMethod.apply(this, arguments);
    };

    if (descriptor.value != null)
        return descriptor;
}
