import {getAnimeQueryResponse} from "../../../../API/anime.interface";
import {RichEmbed} from "discord.js";
import formatAnilistDate from "../../../../API/utils";
import {formattedTimeString, HtmltoMarkdown, normalizeString} from "../../../../utility/Util";
import {AnimeUtils} from "../../../../utility/animeUtils";


export default function getAnimeEmbed(input: getAnimeQueryResponse){
    let title = AnimeUtils.formatTitle(input.title.english, input.title.userPreferred, input.title.native, input.title.romaji);
    let description = AnimeUtils.shortenDescription(input.siteUrl, input.description);

    const image = input.coverImage.large || input.coverImage.medium;
    const characters =
        input.characters && input.characters.nodes.length
        ? input.characters.nodes.splice(0, 5).map(c =>
            `${c.name.first ? c.name.first + ' ' : ''}${c.name.last ? c.name.last : ''}`).join('\n')
        : 'Unknown characters';
    const embed = new RichEmbed()
        .setAuthor(`Anime: ${title}`, )
        .setColor(`#f57d7d`)
        .setDescription(
            `**Genres:** ${input.genres && input.genres.length ? input.genres.join(', ') : 'Unknown genres'}\n` +
            `**Studio:** ${input.studios && input.studios.edges.length ? input.studios.edges[0].node.name : 'Unknown studio'}\n` +
            `**Status:** ${input.status ? normalizeString(input.status) : 'Unknown status'}\n` +
            `**Air Date:** ${input.startDate.year ? formatAnilistDate(input.startDate) : 'Unknown date'}\n` +
            `**Finish Date:** ${input.endDate.year ? formatAnilistDate(input.endDate) : 'Unknown date'}\n` +
            `**Total Episodes:** ${input.episodes ? input.episodes : 'Unknown episodes'}\n` +
            `**Average Score:** ${input.averageScore ? `${input.averageScore}/100` : 'Unknown score'}\n` +
            `**Average Episode Length:** ${input.duration ? `${input.duration} minutes` : 'Unknown time'}\n` +
            `**Total Watch Time:** ${input.duration ? `${formattedTimeString(input.duration * input.episodes * 60)}` : 'Unknown time'}\n\n` +
            `**Main Characters:**\n${characters}\n\n` +
            `**Description:** ${HtmltoMarkdown(description)}`)
        .setThumbnail(image);
    if (input.nextAiringEpisode){
        embed.setFooter(
            `Episode ${input.nextAiringEpisode.episode} releases in ${formattedTimeString(input.nextAiringEpisode.timeUntilAiring)} | Powered by AniList`,
            `https://cdn.hifumi.io/assets/anilist.png`
        );
    }
    else {
        embed.setFooter(`Powered by AniList`, `https://cdn.hifumi.io/assets/anilist.png`)
    }
    if (input.bannerImage){
        embed.setImage(input.bannerImage);
    }
    return embed;
}
