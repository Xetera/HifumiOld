import axios, {AxiosRequestConfig, AxiosPromise} from 'axios'
import * as Discord from 'discord.js'
import * as cheerio from 'cheerio'
import {CHBaseEndpoint, CHBaseEndpointMaxValue} from "../Endpoints/CyanideAndHappinessEndpoints";
import {randRange} from "../../Utility/Util";
import * as dbg from 'debug'
import gb from "../../Misc/Globals";

const debug = {
    error: dbg('Bot:CH:Error')
};

export default function ch(message : Discord.Message) : void {
    const endpoint : string = CHBaseEndpoint;
    const maxValue : number = CHBaseEndpointMaxValue;
    const comicId  : number = randRange(0, maxValue);
    axios.get(endpoint + 'random').then((res) => {
        const $ = cheerio.load(res.data);
        message.channel.send('http:' + $('#main-comic').attr('src'));
    }).catch(err => {
        debug.error('There was an error fetching fetching CH comic\n', err);
        message.channel.send(`Uh... I couldn\'t fetch your comic, go bother <@${gb.ownerID}> about it.`);
    });
}