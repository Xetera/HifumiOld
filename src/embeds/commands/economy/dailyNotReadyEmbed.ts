import {RichEmbed} from "discord.js";
import {formattedTimeString} from "../../../utility/Util";
import {warningEmbedColor} from "../../../utility/Settings";

export default function dailyNotReadyEmbed(restAmount: number){
    return new RichEmbed()
        .setTitle(`Hold up!`)
        .setColor(`#ffa191`)
        .setDescription(`Your daily becomes available in ${formattedTimeString(restAmount)}`);
}
