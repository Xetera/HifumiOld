import axios, {AxiosInstance, AxiosResponse} from "axios";
import {getAnimeQueryResponse, ICharacter, IVoiceActor, MALResponse, WhatAnimeSearchResponse} from "./anime.interface";
import {promisify} from "util";
import {Attachment, Message, RichEmbed, TextChannel} from "discord.js";
import getAnimeEmbed from "../embeds/commands/fun/anime/getAnimeEmbed";
import animeNotFoundEmbed from "../embeds/commands/fun/anime/animeNotFoundEmbed";
import nsfwAnimeWarningEmbed from "../embeds/commands/fun/anime/nsfwAnimeWarningEmbed";
import {Environments} from "../events/systemStartup";
import {debug} from "../utility/Logging";
import getCharacterEmbed from "../embeds/commands/fun/anime/getCharacterEmbed";
import characterNotFoundEmbed from "../embeds/commands/fun/anime/characterNotFoundEmbed";
import {AnimeUtils} from "../utility/animeUtils";
import {normalizeString, StringUtils} from "../utility/Util";
import {fetchUrlAsBase64} from "./utils";
import whatAnimeEmbed from "../embeds/commands/fun/anime/whatAnimeEmbed";
import {Inject, Singleton} from "typescript-ioc";
import {IClient} from "../interfaces/injectables/client.interface";
import {IDatabase} from "../interfaces/injectables/datbase.interface";
import {handleFatalErrorGracefully} from "../handlers/process/fatal";
import {IAnime} from "../interfaces/injectables/anime.interface";

const fs = require('fs');
const readFile = promisify(fs.readFile);

@Singleton
export default class Anime extends IAnime {
    private readonly endpoint = 'https://graphql.anilist.co/';
    private readonly MALEndpoint = 'https://myanimelist.net/search/prefix.json?type=all&keyword=';
    private anilist: AxiosInstance;
    private readonly whatanimeKey: string;
    @Inject client: IClient;
    @Inject database: IDatabase;

    private constructor() {
        super();
        const whatAnimeKey = process.env['WHATANIME_KEY'];
        if (this.client.env === Environments.Development) {
            if (!whatAnimeKey) {
                debug.warning(`'WHATANIME_KEY' was not found, Whatanime module is disabled.`)
            } else {
                this.whatanimeKey = whatAnimeKey;
            }
        } else if (this.client.env === Environments.Production) {
            if (!whatAnimeKey) {
                handleFatalErrorGracefully(new Error(
                    "Required Anime environment variable 'WHATANIME_KEY' was not set in production mode."
                ));
                return this;
            }
            this.whatanimeKey = whatAnimeKey;
        }
        this.anilist = axios.create({
            baseURL: this.endpoint,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    private static async getQuery(query: string): Promise<string> {
        return await readFile(`src/API/graphql/queries/${query}.graphql`, {encoding: 'utf8'})
    }


    public async getAnime(message: Message, anime: string): Promise<RichEmbed | string> {

        /**
         * Why do you do it like this you ask? As much as I love AniList it has a god
         * awful search system.
         */
        const res: AxiosResponse<MALResponse> = await axios.get(encodeURI(this.MALEndpoint + anime));

        const MALId: number | undefined = AnimeUtils.getRelevantMALId(res.data, anime);
        if (!MALId) {
            return await animeNotFoundEmbed(message.guild.id, 'anime')
        }
        let response: AxiosResponse<{ data: { Media: getAnimeQueryResponse } }>;
        try {
            response = await this.anilist.post(`/`,
                JSON.stringify({
                    query: await Anime.getQuery('getAnimeByMalId'),
                    variables: {
                        id: MALId
                    }
                }));
        } catch (err) {
            if (err.response.status === 404) {
                return await animeNotFoundEmbed(message.guild.id, 'anime');
            }
            return `Something went wrong while looking up this anime.`
        }

        const data = response.data.data.Media;
        if (data.isAdult && message.channel instanceof TextChannel && !message.channel.nsfw) {
            return nsfwAnimeWarningEmbed();
        }
        return getAnimeEmbed(data);
    }

    private async getAnimeByAnilistId(id: string) {
        const response: AxiosResponse<{ data: { Media: getAnimeQueryResponse } }> = await this.anilist.post(`/`,
            JSON.stringify({
                query: await Anime.getQuery('getAnimeByAnilistId'),
                variables: {
                    id: id
                }
            }));
        return response.data.data.Media;
    }

    public async getCharacter(message: Message, character: string) {
        try {
            const response: AxiosResponse<{ data: { Character: ICharacter } }> = await this.anilist.post(`/`,
                JSON.stringify({
                        query: await Anime.getQuery('getCharacter'),
                        variables: {
                            search: character
                        }
                    }
                ));
            const data = response.data.data.Character;
            let VA: IVoiceActor | undefined;
            if (data.media && data.media.edges.length) {
                const medias = data.media.edges.filter(
                    i => i.node && i.node.type === 'ANIME'
                );
                // might be slightly wrong but it's fine
                const chosenMedia = medias[0];
                if (chosenMedia && chosenMedia.voiceActors && chosenMedia.voiceActors.length) {
                    VA = await this.getVoiceActor(chosenMedia.voiceActors[0].id);
                }
            }
            return getCharacterEmbed(data, VA);
        }
        catch (err) {
            debug.error(err, `getCharacter`);
            if (!err.response) {
                return Promise.reject(err);
            }
            if (err.response.status === 404) {
                return await characterNotFoundEmbed(message.guild.id)
            }
            return Promise.reject(err);
        }
    }

    public async getVoiceActor(id: number): Promise<IVoiceActor | undefined> {
        try {
            const response: AxiosResponse<{ data: { Staff: IVoiceActor } }> = await this.anilist.post(`/`,
                JSON.stringify({
                    query: await Anime.getQuery('getVoiceActorById'),
                    variables: {
                        id: id
                    }
                }));
            return response.data.data.Staff;
        }
        catch (err) {
            debug.error(err, `Anime`);
            return undefined;
        }
    }

    public async reverseSearch(picture: string, isGif: boolean): Promise<[(RichEmbed | string), (Attachment | undefined)]> {
        let base64: string;
        if (StringUtils.isUrl(picture)) {
            let buffer;
            try {
                buffer = await fetchUrlAsBase64(picture, isGif);
            } catch (err) {
                console.log(err);
                return [err, undefined]
            }

            if (!buffer) {
                return ["Not a valid image", undefined];
            }
            base64 = buffer;
        } else {
            // we probably shouldn't be trusting here but whatever
            base64 = picture;
        }

        let response: AxiosResponse<WhatAnimeSearchResponse | string>;
        try {
            response = await axios.post(`https://whatanime.ga/api/search?token=${this.whatanimeKey}`,
                `image=${base64}`,
                {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'charset': 'UTF-8'}});

        } catch (e) {
            if (e.response.status === 413) {
                return [
                    "That is a _pretty_ gigantic image. There's a 1MB upload limit for this, choose something smaller. " +
                    "I will be able to compress and resize images automatically in future updates.",
                    undefined
                ]
            }
            else if (e.response.status === 504) {
                return [
                    "Couldn't receive a valid response from the server, it's most likely overloaded.",
                    undefined]
            }
            return [`Huh? That's not supposed to happen!\n**Message: **${e.message || e.response.data}\n**Status Code:** ${e.response.status}`, undefined]
        }

        const data = response.data;

        if (typeof data === 'string') {
            return [data, undefined];
        }


        const result = data.docs[0];

        if (!result) {
            return ["Could not receive a response from the server, either whatanime.ga API is down or " +
            "there's a problem somewhere else.", undefined]
        }

        const [buffer, anilistResponse] = await Promise.all([
            this.getReverseSearchGif(result.anilist_id, result.filename, result.at, result.tokenthumb),
            this.getAnimeByAnilistId(result.anilist_id.toString())
        ]);
        const parsed = AnimeUtils.parseAnilistResponse(anilistResponse, result.episode);
        const embed = whatAnimeEmbed(parsed, result.episode, result.similarity, buffer);
        const mediaTitle = normalizeString(result.title_english + '_Episode_' + result.episode + '.mp4');
        return [embed, new Attachment(buffer, mediaTitle)];
    }

    private async getReverseSearchGif(anilist_id: number, filename: string, at: number, token: string) {
        const response = await axios.get(
            `https://whatanime.ga/preview.php?anilist_id=${anilist_id}&file=${encodeURIComponent(filename)}&t=${at}&token=${token}`,
            {responseType: 'arraybuffer'});
        return response.data
    }
}
