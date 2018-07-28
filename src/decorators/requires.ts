import {Message, PermissionResolvable} from "discord.js";
import safeSendMessage from "../handlers/safe/SafeSendMessage";
import missingSelfPermission from "../embeds/permissions/missingSelfPermission";

export function requires(permission: PermissionResolvable | PermissionResolvable[]) {
    return (target: any, key: string, descriptor: any) => {
        let originalMethod = descriptor.value;

        descriptor.value =  function (...args: any[]) {
            const message: Message = args[0].message;
            if (!message.guild.me.hasPermission(permission)){
                missingSelfPermission(message.guild, permission).then(e => {
                    safeSendMessage(message.channel, e)
                })
            }
            else {
                return originalMethod.apply(this, args);
            }
        };
        if (descriptor.value != null)
            return descriptor;
    }
}
