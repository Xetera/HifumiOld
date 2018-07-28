import * as Discord from "discord.js";
import {gb} from "../misc/Globals";

export default function onlyOwner(target : any, key: any , descriptor: any) {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
        const message : Discord.Message = arguments[0].message;
        if (message.member.id !== gb.ownerID){
            // we don't want to respond to this
            return;
        }
        return originalMethod.apply(this, arguments);
    };

    if (descriptor.value != null)
        return descriptor;
}
