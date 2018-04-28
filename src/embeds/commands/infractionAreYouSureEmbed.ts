import {RichEmbed} from "discord.js";
import ReactionManager from "../../handlers/reactions/reactionManager";
import {random} from "../../utility/Util";

export default function infractionAreYouSureEmbed(q: string, expiration: number){
    return new RichEmbed()
        .addField(`Are you sure about that?`, q)
        .setThumbnail(random(ReactionManager.getInstance().sorry))
        .setFooter(`Respond with 'y' or n', this expires after ${expiration} seconds.`);
}
