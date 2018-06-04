import {ArgOptions, ArgType, DecoratorReturnSignature} from "./expects";
import {register} from "../handlers/commands/registry";
import {Message, PermissionResolvable, Permissions} from "discord.js";
import gb from "../misc/Globals";
import missingAdminEmbed from "../embeds/permissions/missingAdminEmbed";
import safeSendMessage from "../handlers/safe/SafeSendMessage";
import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
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
