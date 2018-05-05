import {Message, RichEmbed} from "discord.js";
import gb from "../../misc/Globals";
import ReactionManager from "../../handlers/internal/reactions/reactionManager";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

export default async function iHateYou(message: Message) {
    const embed = new RichEmbed()
        .setTitle(`:(`)
        .setColor('PURPLE')
        .setDescription(`I'm sorry... Did something break? Am I acting up again?\nYou can get help or shout at the person who made me [here](https://discord.gg/RM6KUrf).`)
        .setFooter(`I still love you though <3`);

    if (await gb.instance.database.getReactions(message.guild.id)){
        embed.setThumbnail(ReactionManager.getInstance().crying)
    }
    safeSendMessage(message.channel, embed);
}
