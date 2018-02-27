import {DiscordAPIError, Message} from "discord.js";
import {debug} from "../Events/onMessage";

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

export function formatTime(seconds : number) : string {
    let moduloSeconds : number = Math.floor(seconds % 60);
    let minutes : number = Math.floor(seconds/60);
    let moduloMinutes : number = Math.floor(minutes % 60);
    let hours : number = Math.floor(minutes/60);
    let moduloHours : number = Math.floor(hours % 24);
    let days : number = Math.floor(hours/24);

    if (seconds < 60)
        return `${Math.floor(seconds)}s`;
    else if (minutes < 60) {
        return `${minutes}m:${moduloSeconds}s`
    }
    else if (hours < 24){
        return `${hours}h:${moduloMinutes}m:${moduloSeconds}`;
    }
    else {
        return `${days}d:${moduloHours}h:${moduloMinutes}m:${moduloSeconds}`;
    }
}
export enum ETime {
    Seconds,
    Minutes,
    Hours,
    Days,
    Weeks,
    Months,
    Years
}

