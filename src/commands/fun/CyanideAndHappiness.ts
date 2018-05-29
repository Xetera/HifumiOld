import axios, {AxiosRequestConfig, AxiosPromise} from 'axios'
import * as Discord from 'discord.js'
import * as cheerio from 'cheerio'
import {CHBaseEndpoint} from "../endpoints/CyanideAndHappinessEndpoints";
import {random} from "../../utility/Util";
import * as dbg from 'debug'
import gb from "../../misc/Globals";
import chEmbed from "../../embeds/commands/fun/chEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {randomRuntimeError} from "../../interfaces/Replies";

const debug = {
    error: dbg('Bot:CH:Error')
};

export default async function ch(message : Discord.Message) : Promise<void> {
    try {
        const res = await axios.get(CHBaseEndpoint);
        const $ = cheerio.load(res.data);
        const paths = res.request.path.split('/');
        const comicNumber: string = paths[paths.length - 2];
        const url: string = 'http:' + $('#main-comic').attr('src');

        const embed = chEmbed(comicNumber, url);
        return void safeSendMessage(message.channel, embed);
    }
    catch (err){
        debug.error('There was an error fetching fetching CH comic\n', err);
        safeSendMessage(message.channel, randomRuntimeError());
    }
}
