import {Channel, RichEmbed} from "discord.js";
import {ConfigChannelEmojis, ConfigChannelType} from "./setConfigChannelEmbed";
import {random} from "../../../utility/Util";
import {shocked} from "../../../handlers/internal/reactions/reactionManager";

export default function setConfigChannelFailEmbed(channel: Channel, type: ConfigChannelType){
    const emoji = ConfigChannelEmojis[type];
    return new RichEmbed()
        .setTitle(`Error! ${emoji}`)
        .setColor(`#ff0000`)
        .setDescription(`Oh no something went wrong, I couldn't set your ${type} channel.`)
        .setThumbnail(random(shocked))
}
