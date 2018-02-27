import * as Discord from 'discord.js'
import {formatTime} from "../../Utility/Util";
import * as moment from "moment";
import gb from "../../Misc/Globals";
import {Environments} from "../../Events/systemStartup";

export default function uptime(message: Discord.Message, bot : Discord.Client){
    const time = moment.duration(bot.uptime);
    const days = Math.floor(time.asDays());
    const hours = Math.floor(time.asHours());
    const minutes = Math.floor(time.asMinutes());
    const seconds = Math.floor(time.asSeconds());
    let env : string = gb.ENV === Environments.Live ? 'cloud' : 'localhost';

    let currentUptime: string;

    if (days >= 1){
        currentUptime = `${days}d:${hours}h:${minutes}m:${seconds}s`;
    }
    else if (hours >= 1){
        currentUptime = `${hours}h:${minutes}m:${seconds}s`;
    }
    else if (minutes >= 1){
        currentUptime = `${minutes}m:${seconds}s`;
    }
    else if (seconds >= 1){
        currentUptime =`${seconds}s`;
    }
    else if (seconds <= 1){
        currentUptime = `literally came on this exact second, how did you even do that`;
    }
    else {
        throw new Error('There was a problem getting uptime from discord.');
    }
    message.channel.send(`I've been online on ${env} for: ${currentUptime}`);
}