import {Channel, RichEmbed} from "discord.js";
import {ConfigChannelEmojis, ConfigChannelType} from "./setConfigChannelEmbed";
import ReactionManager from "../../../handlers/internal/reactions/reactionManager";
import {random} from "../../../utility/Util";
import {IReactionManager} from "../../../interfaces/injectables/reactionManager.interface";
import {Container} from "typescript-ioc";

export default function setConfigChannelFailEmbed(channel: Channel, type: ConfigChannelType){
    const emoji = ConfigChannelEmojis[type];
    const rm: IReactionManager = Container.get(IReactionManager);
    return new RichEmbed()
        .setTitle(`Error! ${emoji}`)
        .setColor(`#ff0000`)
        .setDescription(`Oh no something went wrong, I couldn't set your ${type} channel.`)
        .setThumbnail(random(rm.shocked))
}
