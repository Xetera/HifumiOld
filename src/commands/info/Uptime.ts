import * as Discord from 'discord.js'
import {formattedTimeString, formatTime} from "../../utility/Util";
import * as moment from "moment";
import gb from "../../misc/Globals";
import {Environments} from "../../events/systemStartup";

export default function uptime(message: Discord.Message, bot : Discord.Client){
    let env : string = gb.ENV === Environments.Live ? 'cloud': 'localhost';
    const currentUptime = message.client.uptime/1000;
    const out = formattedTimeString(currentUptime);
    message.channel.send(`I've been online on ${env} for: ${out}`).catch()
}