import {RichEmbed} from "discord.js";
import {random} from "../../../utility/Util";
import {IReactionManager} from "../../../interfaces/injectables/reactionManager.interface";
import {Container} from "typescript-ioc";

export default function setReactionsEmbed(state: boolean){
    const rm: IReactionManager = Container.get(IReactionManager);
    if (!state){
        return new RichEmbed()
            .setColor('#eec2ff')
            .addField(`Reactions Off`, `Oh... ok this will be the last time I add reactions to my replies.`)
            .setThumbnail(rm.crying)
    }
    return new RichEmbed()
        .setColor('#eec2ff')
        .addField(`Reactions On`, `Yay, I'll be adding reactions to some of my messages from now on!`)
        .setThumbnail(random(rm.smile))
}
