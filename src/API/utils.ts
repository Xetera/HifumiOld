import {IAnilistDate} from "./anime.interface";
import {StringUtils} from "../utility/Util";
import axios from 'axios'

export default function formatAnilistDate(date: IAnilistDate){
    if (date.day && date.month && date.year){
        return `${date.month}/${date.day}/${date.year}`;
    }
    else if (!date.day && date.month && date.year){
        return `${date.month}/${date.year}`;
    }
    else if (!date.day && !date.month && date.year){
        return `${date.year}`;
    }
    return `Unknown date`;
}

export async function fetchUrlAsBase64(url: string): Promise<string | undefined> {
    if (!StringUtils.isUrl(url)){
        return;
    }
    const response = await axios.get(url, {responseType: 'arraybuffer'});
    return new Buffer(response.data, 'binary').toString('base64')
}
