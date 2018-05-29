import {RichEmbed} from "discord.js";
import {formattedTimeString} from "../../utility/Util";
import {warningEmbedColor} from "../../utility/Settings";

export default function commandThrottleEmbed(time: number){
    return new RichEmbed()
        .setTitle(`Whoa slow down`)
        .setColor(warningEmbedColor)
        .setDescription(`Hey stop that, give me some time to breathe!\nI need **${formattedTimeString(time)}** to recharge after that command.`);
}
