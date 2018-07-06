import axios, {AxiosInstance, AxiosResponse} from "axios";
import {getAnimeQueryResponse, ICharacter, IVoiceActor, MALResponse} from "./anime.interface";
import {promisify} from "util";
import {Message, RichEmbed, TextChannel} from "discord.js";
import getAnimeEmbed from "../embeds/commands/fun/anime/getAnimeEmbed";
import animeNotFoundEmbed from "../embeds/commands/fun/anime/animeNotFoundEmbed";
import nsfwAnimeWarningEmbed from "../embeds/commands/fun/anime/nsfwAnimeWarningEmbed";
import gb from "../misc/Globals";
import {Environments} from "../events/systemStartup";
import {debug} from "../utility/Logging";
import getCharacterEmbed from "../embeds/commands/fun/anime/getCharacterEmbed";
import characterNotFoundEmbed from "../embeds/commands/fun/anime/characterNotFoundEmbed";
import {AnimeUtils} from "../utility/animeUtils";
const fs = require('fs');
const readFile = promisify(fs.readFile);

export default class Anime {
    private readonly endpoint = 'https://graphql.anilist.co/';
    private readonly MALEndpoint = 'https://myanimelist.net/search/prefix.json?type=all&keyword=';
    private static _instance: Anime;
    private readonly clientId: string;
    private readonly clientSecret: string;
    private api: AxiosInstance;
    private tokenExpiration: number;

    private constructor() {
        if (gb.ENV === Environments.Development){
            this.clientId = require('../../config0.json').anilist.client_id;
            this.clientSecret = require('../../config0.json').anilist.client_secret;
        } else {
            this.clientId = process.env['ANILIST_CLIENT_ID']!;
            this.clientSecret = process.env['ANILIST_CLIENT_SECRET']!;

        }
        this.api = axios.create({
            baseURL: this.endpoint,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        //this.getAnime('new game')

    }

    public static getInstance(): Anime {
        if (!Anime._instance){
            Anime._instance = new this();
        }
        return Anime._instance;
    }

    private static async getQuery(query: string): Promise<string>{
        return await readFile(`src/API/graphql/queries/${query}.graphql`, {encoding: 'utf8'})
    }


    public async getAnime(message: Message, anime: string): Promise<RichEmbed> {
        /**
         * Why do you do it like this you ask? As much as I love AniList it has a god
         * awful search system.
         */
        const res: AxiosResponse<MALResponse> = await axios.get(encodeURI(this.MALEndpoint + anime));

        const MALId: number | undefined = AnimeUtils.getRelevantMALId(res.data, anime);
        if (!MALId){
            return await animeNotFoundEmbed(message.guild.id, 'anime')
        }
        const response: AxiosResponse<{ data: { Media: getAnimeQueryResponse } }> = await this.api.post(`/`,
            JSON.stringify({
                query: await Anime.getQuery('getAnimeByMalId'),
                variables: {
                    id: MALId
                }
            }));

        const data = response.data.data.Media;
        if (data.isAdult && message.channel instanceof TextChannel && !message.channel.nsfw){
            return nsfwAnimeWarningEmbed();
        }
        return getAnimeEmbed(data);
        /*
        try {
            const response: AxiosResponse<{ data: { Media: getAnimeQueryResponse } }> = await this.api.post(`/`,
                JSON.stringify({
                    query: await Anime.getQuery('getAnime'),
                    variables: {
                        search: anime
                    }
                }));

            const data = response.data.data.Media;
            if (data.isAdult && message.channel instanceof TextChannel && !message.channel.nsfw){
                return nsfwAnimeWarningEmbed();
            }
            return getAnimeEmbed(data);
        }
        catch (err){
            if (!err.response){
                return Promise.reject(err);
            }
            if (err.response.status === 404){
                return await animeNotFoundEmbed(message.guild.id, 'anime')
            }
            return Promise.reject(err);
        }
        */
    }

    public async getCharacter(message: Message, character: string){
        console.log(character);
        try {
            const response: AxiosResponse<{data: {Character: ICharacter } }> = await this.api.post(`/`,
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
                if (chosenMedia && chosenMedia.voiceActors && chosenMedia.voiceActors.length){
                    VA = await this.getVoiceActor(chosenMedia.voiceActors[0].id);
                }
            }
            return getCharacterEmbed(data, VA);
        }
        catch (err){
            debug.error(err, `getCharacter`);
            if (!err.response){
                return Promise.reject(err);
            }
            if (err.response.status === 404){
                return await characterNotFoundEmbed(message.guild.id)
            }
            return Promise.reject(err);
        }
    }

    public async getVoiceActor(id: number): Promise<IVoiceActor | undefined>{
        try {
            const response: AxiosResponse<{ data: { Staff: IVoiceActor } }> = await this.api.post(`/`,
                JSON.stringify({
                    query: await Anime.getQuery('getVoiceActorById'),
                    variables: {
                        id: id
                    }
                }));
            return response.data.data.Staff;
        }
        catch (err){
            debug.error(err, `Anime`);
            return undefined;
        }
    }


}
