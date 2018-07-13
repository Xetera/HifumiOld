import {IAnilistDate} from "./anime.interface";
import {getUrlExtension, StringUtils} from "../utility/Util";
import axios, {AxiosResponse} from 'axios'
//@ts-ignore
import * as gif from 'gif-frames'
import sta = require('stream-to-array')
import * as gm from 'gm'
import * as util from "util";

export default function formatAnilistDate(date: IAnilistDate) {
    if (date.day && date.month && date.year) {
        return `${date.month}/${date.day}/${date.year}`;
    }
    else if (!date.day && date.month && date.year) {
        return `${date.month}/${date.year}`;
    }
    else if (!date.day && !date.month && date.year) {
        return `${date.year}`;
    }
    return `Unknown date`;
}

export async function fetchFirstGifFrame(arraybuffer: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        gif({url: arraybuffer, frames: 0}).then((frameInfo: any )=> {
            const stream = frameInfo[0].getImage();
            sta(stream, ((err: Error, arr: any[]) => {
                if (err){
                    reject(err)
                }
                const buffers = arr
                    .map(part => util.isBuffer(part) ? part : Buffer.from(part));
                resolve(Buffer.concat(buffers));
            }))
        }).catch(reject)
    });
}

export async function fetchUrlAsBase64(url: string, isGif: boolean): Promise<string | undefined> {
    if (!StringUtils.isUrl(url)) {
        return;
    }
    const response: AxiosResponse<string> = await axios.get(url, {responseType: 'arraybuffer'});
    let out: Buffer | string;
    if (isGif && getUrlExtension(url) === 'gif') {
        out = await fetchFirstGifFrame(response.data);
    } else {
        out = response.data;
    }
    //@ts-ignore
    return new Buffer(out, 'binary').toString('base64')
}
