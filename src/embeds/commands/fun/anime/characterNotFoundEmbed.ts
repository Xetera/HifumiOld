import {RichEmbed} from "discord.js";
import {canSendReactions} from "../../../../handlers/internal/reactions/reactionManager";

export default async function characterNotFoundEmbed(guildId: string){
    const embed = new RichEmbed()
        .setTitle(`Where is it... Where is it?!`)
        .setDescription(`I couldn't find that character.\nI'm picky with spelling!\nSorry... (´・ω・\`)`)
        .setColor(`#fff75e`);

    if (await canSendReactions(guildId)){
        embed.setImage('https://cdn.discordapp.com/attachments/443834322781470731/444055892049002496/ano.png')
    }
    return embed;
}
