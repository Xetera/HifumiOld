import * as Discord from 'discord.js'
import {formattedTimeString, formatTime} from "../../utility/Util";
import * as moment from "moment";
import gb from "../../misc/Globals";
import {Environments} from "../../events/systemStartup";
import uptimeEmbed from "../../embeds/commands/uptimeEmbed";

export default function uptime(message: Discord.Message, bot : Discord.Client){
    let env : string = gb.ENV === Environments.Live ? 'cloud': 'localhost';
    const currentUptime = message.client.uptime/1000;
    const out = formattedTimeString(currentUptime);
    message.channel.send(uptimeEmbed(out)).catch(console.log)
}
