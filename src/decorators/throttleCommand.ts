import {CommandParameters} from "../handlers/commands/CommandHandler";
import {Command} from "../commands/info/help/help.interface";
import moment = require("moment");
import commandThrottleEmbed from "../embeds/commands/commandThrottleEmbed";
import gb from "../misc/Globals";
import {debug} from "../utility/Logging";
let userCommands: {[id:string]: Date} = {};
let throttleMap: {[user_id: string]: {[id:string]: Date}} = {};

export function throttle(duration: number) {
    return function decorator(t: any, name: any, descriptor: any) {
        const original = descriptor.value;
        if (typeof original === 'function') {
            descriptor.value = function(...args: any[]) {
                const params = <CommandParameters> args[0];
                const userId = params.message.author.id;
                const command = throttleMap[name];
                if (!command){
                    throttleMap[name] = {};
                }

                const date = throttleMap[name][userId];
                if (!date){
                    if (!throttleMap[name]){
                        throttleMap[name] = {};
                    }
                    throttleMap[name][userId] = new Date();
                }

                else if (moment(date).add(duration ,'s').toDate() > new Date() && params.message.author.id !== gb.ownerID){
                    debug.info(`User ${params.message.author.username} was throttled`, `ThrottleCommand`);
                    params.message.channel.send(commandThrottleEmbed(duration));
                    return;
                }
                else {
                    if (throttleMap[name]){
                        throttleMap[name] = {};
                    }
                    throttleMap[name][userId] = new Date();
                }
                return original.apply(null, args);
            }
        }
        return descriptor;
    };
}
