import {MALMedia, MALResponse} from "../API/anime.interface";
import {specialCharRegex} from "../listeners/Regex";

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
        if (typeof first !== 'string' && isCharName(first)){
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

    export function formatTitle(english?: string, userPreferred?: string, native?: string, romaji?: string){
        let title = english || userPreferred || romaji;
        if (native && title){
            title += ` (${native})`;
        } else if (native){
            title = native;
        }
        return title;
    }

    export function shortenDescription(link?: string, desc?: string, amount: number = 300){
        if (!desc){
            return 'No description found...';
        }
        if (desc.length > amount){
            desc = desc.substring(0, amount);
            desc += '...';
            if (link){
                desc += `[Read More](${link})`;
            }
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
        console.log(response);
        if (response.categories.length){
            const animeCat = response.categories.find(c => c.type === 'anime');
            console.log(animeCat);
            if (!animeCat || !animeCat.items.length){
                return;
            } else if (specialCharRegex.test(search)){
                /**
                 * Unfortunately because the search kinda sucks on MAL too,
                 * the system throws away all special characters which breaks
                 * on animes like New Game!! so in that case we want to search
                 * through all the responses instead of
                 */
                console.log('contains special chars');
                const exactMatch = animeCat.items.find(item => item.name.toLowerCase() === search.toLowerCase());
                console.log(exactMatch);
                if (exactMatch){
                    return exactMatch.id;
                }
            }
            // we're already checking to see if we got items in the previous thing
            return animeCat.items.shift()!.id;
        }
    }
}
