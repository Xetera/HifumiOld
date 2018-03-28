import * as Discord from "discord.js";
import gb from "../../../misc/Globals";
import missingModEmbed from "../../../embeds/permissions/missingModEmbed";

export default function onlyMod(target : any, key: any , descriptor: any) {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
        const message : Discord.Message = arguments[0].message;
        if (!message.member.permissions.has("BAN_MEMBERS")){
            message.channel.send(missingModEmbed());
            return;
        }
        return originalMethod.apply(this, arguments);
    };

    if (descriptor.value != null)
        return descriptor;
}
