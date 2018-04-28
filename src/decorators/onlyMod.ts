import * as Discord from "discord.js";
import missingModEmbed from "../embeds/permissions/missingModEmbed";
import gb from "../misc/Globals";

export default function onlyMod(target : any, key: any, descriptor: any) {
    const original = descriptor.value;
    descriptor.value = function () {
        const message : Discord.Message = arguments[0].message;
        if (!message.member.permissions.has("BAN_MEMBERS") || message.member.id !== gb.ownerID){
            return missingModEmbed(message.guild).then(e => {
                return void message.channel.send(e);
            });
        }
        return original.apply(this, arguments);
    };
    if (descriptor.value != null)
        return descriptor;
}
