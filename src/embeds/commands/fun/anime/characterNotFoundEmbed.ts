import {RichEmbed} from "discord.js";
import {IReactionManager} from "../../../../interfaces/injectables/reactionManager.interface";
import {Container} from "typescript-ioc";

export default async function characterNotFoundEmbed(guildId: string){
    const rm: IReactionManager = Container.get(IReactionManager);
    const embed = new RichEmbed()
        .setTitle(`Where is it... Where is it?!`)
        .setDescription(`I couldn't find that character.\nI'm picky with spelling!\nSorry... (´・ω・\`)`)
        .setColor(`#fff75e`);

    if (await rm.canSendReactions(guildId)){
        embed.setImage('https://cdn.discordapp.com/attachments/443834322781470731/444055892049002496/ano.png')
    }
    return embed;
}
