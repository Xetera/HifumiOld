import {getAnimeQueryResponse, MALMedia, MALResponse, ParsedAnimeResponse} from "../API/anime.interface";
import {specialCharRegex} from "../listeners/Regex";
import {formattedTimeString, HtmltoMarkdown} from "./Util";

interface ICharacterName {
    first?: string;
    last?: string;
    native?: string;
}

function isCharName(obj: any): obj is ICharacterName {
    return 'first' in obj || 'last' in obj || 'native' in obj;
}

export namespace AnimeUtils {
    export function formatName(first?: string | ICharacterName, last?: string, native?: string, japanese: boolean = true): string {
        if (typeof first !== 'string' && isCharName(first)) {
            return AnimeUtils.formatName(first.first, first.last, first.native, japanese);
        }

        let name = '';

        name += first ? `${first} ` : '';
        name += last ? `${last} ` : '';

        if (native && japanese) {
            if (first || last) {
                name += `(${native})`;
            } else {
                name += native;
            }
        } else {
            name += '';
        }

        if (!name) {
            name = 'Unknown Character';
        }
        return name;
    }

    export function formatTitle(english?: string, userPreferred?: string, native?: string, romaji?: string) {
        let title = english || userPreferred || romaji;
        if (native && title) {
            title += ` (${native})`;
        } else if (native) {
            title = native;
        }
        return title;
    }

    export function shortenDescription(link?: string, desc?: string, amount: number = 300) {
        if (!desc) {
            return 'No description found...';
        }
        if (desc.length > amount) {
            desc = desc.substring(0, amount);
            desc += '...';
            if (link) {
                desc += `[Read More](${link})`;
            }
        } else {
            desc += `\n[Read More](${link})`;
        }
        return desc;
    }

    export function getHyperlink(title: string, hyperlink?: string): string {
        if (!hyperlink) {
            return title;
        }
        return `[${title}](${hyperlink})`
    }

    export function getRelevantMALId(response: MALResponse, search: string): number | undefined {
        if (response.categories.length) {
            const animeCat = response.categories.find(c => c.type === 'anime');
            if (!animeCat || !animeCat.items.length) {
                return;
            } else if (specialCharRegex.test(search)) {
                /**
                 * Unfortunately because the search kinda sucks on MAL too,
                 * the system throws away all special characters which breaks
                 * on animes like New Game!! so in that case we want to search
                 * through all the responses instead of
                 */
                const exactMatch = animeCat.items.find(item => item.name.toLowerCase() === search.toLowerCase());
                if (exactMatch) {
                    return exactMatch.id;
                }
            }
            // we're already checking to see if we got items in the previous thing
            return animeCat.items.shift()!.id;
        }
    }
    export function parseAnilistResponse(input: getAnimeQueryResponse, episode?: number | string) {
        let out =  <ParsedAnimeResponse> {
            genres: input.genres && input.genres.length ? input.genres.join(', ') : 'Unknown Genre',
            title: AnimeUtils.formatTitle(input.title.english, input.title.userPreferred, input.title.native, input.title.romaji),
            isAdult: input.isAdult,
            siteUrl: input.siteUrl,
            averageScore: input.averageScore,
            description:  HtmltoMarkdown(AnimeUtils.shortenDescription(input.siteUrl, input.description)),
            episodes: input.episodes ? input.episodes : 'Unknown episodes',
            duration: input.duration ? `${input.duration} minutes` : 'Unknown time',
            watchTime: input.duration ? `${formattedTimeString(input.duration * input.episodes * 60)}` : 'Unknown time',
            thumbnail: input.coverImage.large || input.coverImage.medium,
        };
        if (episode && input.streamingEpisodes && input.streamingEpisodes.length){
            if (typeof episode === 'number'){
                episode = episode.toString()
            }
            const found = input.streamingEpisodes.find(ep => {
                return Boolean(episode && ep.url && ep.url.includes(episode.toString()))
            });
            if (found){
                out.episodeLink = found.url;
            }
        }
        return out;
    }
    export function isPicture(url: string, gif: boolean = false){
        const media = [
            'jpeg', 'png', 'jpg'
        ];
        if (gif){
            media.push('gif')
        }
        const sections = url.split('.');
        if (!sections.length){
            return false
        }
        const ending = sections.pop();
        if (!ending){
            return false;
        }
        return media.includes(ending);
    }
}

