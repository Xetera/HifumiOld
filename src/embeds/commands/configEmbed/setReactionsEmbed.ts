import {RichEmbed} from "discord.js";
import {random} from "../../../utility/Util";
import {crying, smile} from "../../../handlers/internal/reactions/reactionManager";

export default function setReactionsEmbed(state: boolean){
    if (!state){
        return new RichEmbed()
            .setColor('#eec2ff')
            .addField(`Reactions Off`, `Oh... ok this will be the last time I add reactions to my replies.`)
            .setThumbnail(crying)
    }
    return new RichEmbed()
        .setColor('#eec2ff')
        .addField(`Reactions On`, `Yay, I'll be adding reactions to some of my messages from now on!`)
        .setThumbnail(random(smile))
}
