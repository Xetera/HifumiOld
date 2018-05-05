import axios, {AxiosRequestConfig, AxiosPromise} from 'axios'
import * as Discord from 'discord.js'
import * as cheerio from 'cheerio'
import {CHBaseEndpoint} from "../endpoints/CyanideAndHappinessEndpoints";
import {random} from "../../utility/Util";
import * as dbg from 'debug'
import gb from "../../misc/Globals";

const debug = {
    error: dbg('Bot:CH:Error')
};

export default function ch(message : Discord.Message) : void {
    axios.get(CHBaseEndpoint).then((res) => {
        const $ = cheerio.load(res.data);
        message.channel.send('http:' + $('#main-comic').attr('src'));
    }).catch(err => {
        debug.error('There was an error fetching fetching CH comic\n', err);
        message.channel.send(`Uh... I couldn\'t fetch your comic, go bother <@${gb.ownerID}> about it.`);
    });
}
