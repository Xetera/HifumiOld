import {RichEmbed} from "discord.js";
import {ICharacter, IVoiceActor} from "../../../../API/anime.interface";
import { normalizeString, StringUtils} from "../../../../utility/Util";
import {AnimeUtils} from "../../../../utility/animeUtils";

export default function getCharacterEmbed(character: ICharacter, VA?: IVoiceActor){
    let name: string = AnimeUtils.formatName(character.name);
    let embed = new RichEmbed()
        .setTitle(name)
        .setFooter(`Not quite right? Full names give better results. | Powered by AniList`,
            `https://anilist.co/img/icons/android-chrome-512x512.png`)
        .setColor(`#f57d7d`);

    if (character.description){
        embed.setDescription(AnimeUtils.shortenDescription(character.siteUrl, character.description));
    }

    if (character.image.large){
        embed.setThumbnail(character.image.large);
    } else if (character.image.medium){
        embed.setThumbnail(character.image.medium);
    }

    const media = character.media;

    if (media && media.edges && media.edges.length){
        const edges = media.edges;
        const apparances = edges.map(
            edge =>
                // Type of the media
                `**${edge.node.type ? normalizeString(edge.node.type) : 'Unknown Media Type'}:** ` +
                // Title of the media
                `${edge.node.title.userPreferred ? AnimeUtils.getHyperlink(normalizeString(edge.node.title.userPreferred), edge.node.siteUrl): 'Unknown Title'} ` +
                `${edge.node.averageScore ? `${edge.node.averageScore}/100` : 'Unknown Score'}`
        );
        embed.addField(`Appears in`, apparances.join('\n'));
    }
    if (VA){
        embed.addField(`Voice Actor`,
            `**Name: **${AnimeUtils.formatName(VA.name)} ${VA.siteUrl? `-> [More Info](${VA.siteUrl})` : ''}\n`+
            `${VA.description ? `**Description:**\n${StringUtils.shortenByNewlines(VA.description, 200)}` : ''}`
        );
    }

    return embed;
}
