import axios, {AxiosInstance, AxiosResponse} from "axios";
import {getAnimeQueryResponse, getCharacterQueryResponse} from "./anilist";
import {promisify} from "util";
import safeSendMessage from "../handlers/safe/SafeSendMessage";
import {Message, TextChannel} from "discord.js";
import getAnimeEmbed from "../embeds/commands/fun/anime/getAnimeEmbed";
import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
import animeNotFoundEmbed from "../embeds/commands/fun/anime/animeNotFoundEmbed";
import nsfwAnimeWarningEmbed from "../embeds/commands/fun/anime/nsfwAnimeWarningEmbed";
const config = require('../../config0.json');
const fs = require('fs');
const readFile = promisify(fs.readFile);

export default class Anime {
    private readonly endpoint = 'https://graphql.anilist.co/';
    private static _instance: Anime;
    private readonly clientId: string;
    private readonly clientSecret: string;
    private api: AxiosInstance;
    private tokenExpiration: number;

    private constructor() {
        if (config){
            this.clientId = config.anilist.client_id;
            this.clientSecret = config.anilist.client_secret;
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


    public async getAnime(message: Message, input: [string]){
        const [name] = input;
        try {
            const response: AxiosResponse<{ data: { Media: getAnimeQueryResponse } }> = await this.api.post(`/`,
                JSON.stringify({
                    query: await Anime.getQuery('getAnime'),
                    variables: {
                        search: name
                    }
                }));

            const data = response.data.data.Media;
            if (data.isAdult && message.channel instanceof TextChannel && !message.channel.nsfw){
                return safeSendMessage(message.channel, nsfwAnimeWarningEmbed())
            }
            const embed = getAnimeEmbed(data);
            safeSendMessage(message.channel, embed);
        }
        catch (err){
            if (!err.response){
                return console.log(err);
            }
            if (err.response.status === 404){
                safeSendMessage(message.channel, await animeNotFoundEmbed(message.guild.id, 'anime'))
            }
        }
    }

    public async getCharacter(message: Message, input: [string]){
        const [character] = input;
        try {
            const response: AxiosResponse<{data: {Media: getCharacterQueryResponse}}> = await this.api.post(`/`,
            JSON.stringify({
                query: await Anime.getQuery('getCharacter'),
                variables: {
                    search: character
                }
            }
        ));
            const data = response.data.data.Media;

            //const embed = getAnimeEmbed(data);
            //safeSendMessage(message.channel, embed);
        }
        catch (err){
            if (err.response.status === 404){
                safeSendMessage(message.channel, await animeNotFoundEmbed(message.guild.id, 'character'))
            }
        }
    }


}
