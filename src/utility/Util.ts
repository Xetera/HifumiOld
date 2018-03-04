import {DiscordAPIError, Message} from "discord.js";
import {debug} from "../events/onMessage";


/**
 * Returns a random selection from a range of numbers.
 *
 * @param {number} [min=0] - Optional start range.
 * @param {number} range - Max range.
 * @returns {number} - Random choice within range
 */
export function randRange(min : number = 0, range : number) : number{
    if (!min){
        return Math.floor(Math.random() * range);
    }
    return Math.floor(Math.random() * (min - range + 1)) + min
}


export function randBool() : boolean{
    return Math.random () >= 0.5;
}


export function randChoice(array : any[]) : any {
    return array[Math.floor(Math.random() * array.length)];
}

export function pluralize(word : string, number: number) : string | -1 {
    if (number > 1 || number === 0){
        return word + 's';
    }
    else if (number === 1){
        return word;
    }
    return -1;
}


export interface ITime {
    s: number;
    m: number;
    h: number;
    d: number;
    w?: number;
}


export function formatTime(seconds : number) : ITime {
    let moduloSeconds: number = Math.floor(seconds % 60);
    let minutes: number = Math.floor(seconds / 60);
    let moduloMinutes: number = Math.floor(minutes % 60);
    let hours: number = Math.floor(minutes / 60);
    let moduloHours: number = Math.floor(hours % 24);
    let days: number = Math.floor(hours / 24);

    // I know this is disgusting but it's 7 am and I just wanna
    // commit some updates ok don't judge me
    if (seconds < 60)
        return  {
            s: seconds,
            m: 0,
            h: 0,
            d: 0
        };
    else if (minutes < 60) {
        return {
            s: moduloSeconds,
            m: minutes,
            h: 0,
            d: 0
        };
    }
    else if (hours < 24) {
        return {
            s: moduloSeconds,
            m: moduloMinutes,
            h: hours,
            d: 0
        };
    }
    else {
        return {
            s: moduloSeconds,
            m: moduloMinutes,
            h: moduloHours,
            d: days
        };
    }
}