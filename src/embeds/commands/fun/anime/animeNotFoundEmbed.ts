import {RichEmbed} from "discord.js";
import {canSendReactions} from "../../../../handlers/internal/reactions/reactionManager";
export default async function animeNotFoundEmbed(guildId: string, type: 'anime' | 'character'){
    const embed = new RichEmbed()
        .setTitle(`Where is it... Where is it?!`)
        .setDescription(`I couldn't find that ${type}.\nMaybe you made a typo?\nSorry... (´・ω・\`)`)
        .setColor(`#fff75e`);

    if (await canSendReactions(guildId)){
        embed.setImage('https://cdn.discordapp.com/attachments/443834322781470731/444055892049002496/ano.png')
    }
    return embed;
}
