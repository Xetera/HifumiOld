import { RichEmbed} from "discord.js";
import {
    ParsedAnimeResponse,
} from "../../../../API/anime.interface";

export default function whatAnimeEmbed(data: ParsedAnimeResponse, episode: number | string, similarity: number,  image: Buffer){
    let sceneEpisode = `**Scene Found on Episode:** ${episode}/${data.episodes}`;
    if (data.episodeLink){
        sceneEpisode += ` [Watch it here!](${data.episodeLink})`;
    }

    const embed = new RichEmbed()
        .setTitle(`Anime: ${data.title}`)
        .setDescription(
            `${sceneEpisode}\n` +
            `**Certainty:** ${(similarity * 100).toFixed(2)}%\n` +
            `**Genres:** ${data.genres}\n` +
            `**Average Score:** ${data.averageScore ? data.averageScore + '/100' : 'Unknown'}\n`
        )
        .setColor(`#f57d7d`)
        .addField(`Description`, data.description ? data.description : 'No description found')
        .setThumbnail(data.thumbnail);
    if (similarity < 0.85){
        embed.setFooter(
            `This result has less than 85% accuracy, it's probably wrong.`
        )
    }

    return embed;
}

