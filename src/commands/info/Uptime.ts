import * as Discord from 'discord.js'
import {formattedTimeString, formatTime} from "../../utility/Util";
import uptimeEmbed from "../../embeds/commands/uptimeEmbed";

export default function uptime(message: Discord.Message){
    const currentUptime = message.client.uptime/1000;
    const out = formattedTimeString(currentUptime);
    message.channel.send(uptimeEmbed(out)).catch(console.log)
}
