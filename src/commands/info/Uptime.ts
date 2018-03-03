import * as Discord from 'discord.js'
import {formatTime} from "../../utility/Util";
import * as moment from "moment";
import gb from "../../misc/Globals";
import {Environments} from "../../events/systemStartup";

export default function uptime(message: Discord.Message, bot : Discord.Client){
    let env : string = gb.ENV === Environments.Live ? 'cloud': 'localhost';
    const currentUptime = formatTime(message.client.uptime/1000);
    const seconds = currentUptime.s;
    const minutes = currentUptime.m;
    const hours = currentUptime.h;
    const days= currentUptime.d;

    let out : string;
    if (!minutes && !hours && !days)
        out = `${Math.floor(seconds)}s`;
    else if (!hours && !days) {
        out = `${minutes}m:${seconds}s`
    }
    else if (!days) {
        out = `${hours}h:${minutes}m:${seconds}s`;
    }
    else {
        out = `${days}d:${hours}h:${minutes}m:${seconds}s`;
    }

    message.channel.send(`I've been online on ${env} for: ${out}`).catch()
}