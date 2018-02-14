/**
 * Returns a random selection from a range of numbers.
 *
 * @param {number} [min=0] - Optional start range.
 * @param {number} range - Max range.
 * @returns {number} - Random choice within range
 */
export function randRange(min : number =0, range : number) : number{
    if (!min){
        return Math.floor(Math.random() * range);
    }
    return Math.floor(Math.random() * (min - range + 1)) + min
}


export function randBool() : boolean{
    return Math.random () >= 0.5;
}

/**
 * Makes a random selection from an input array
 *
 * @return {*} - random choice from array
 */
export function randChoice(array : Array<any>) : any {
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
