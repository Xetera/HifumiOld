import {Attachment, RichEmbed, RichEmbedOptions} from "discord.js";
import {
    getAnimeQueryResponse,
    ParsedAnimeResponse,
    WhatAnimeDocs,
    WhatAnimeSearchResponse
} from "../../../../API/anime.interface";
import {Stream} from "stream";

export default function whatAnimeEmbed(data: ParsedAnimeResponse, episode: number | string, image: Buffer){
    let sceneEpisode = `**Scene Found on Episode:** ${episode}`;
    if (data.episodeLink){
        sceneEpisode += ` [Watch ${typeof episode === 'number' ? `Episode ${episode}` : 'This Episode'} Here](${data.episodeLink})`;
    }
    return new RichEmbed()
        .setTitle(`Anime: ${data.title}`)
        .setDescription(
            `${sceneEpisode}\n` +
            `**Genres:** ${data.genres.join(', ')}\n` +
            `**Average Score:** ${data.averageScore}\n` +
            `**Total Episodes:** ${data.episodes}\n` +
            `**Total Watch Time:** ${data.watchTime}\n`
        )
        .setColor(`#f57d7d`)
        .addField(`Description`, data.description ? data.description : 'No description found')
        .setThumbnail(data.thumbnail)
}
