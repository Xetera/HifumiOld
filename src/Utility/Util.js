"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns a random selection from a range of numbers.
 *
 * @param {number} [min=0] - Optional start range.
 * @param {number} range - Max range.
 * @returns {number} - Random choice within range
 */
function randRange(min, range) {
    if (min === void 0) { min = 0; }
    if (!min) {
        return Math.floor(Math.random() * range);
    }
    return Math.floor(Math.random() * (min - range + 1)) + min;
}
exports.randRange = randRange;
function randBool() {
    return Math.random() >= 0.5;
}
exports.randBool = randBool;
/**
 * Makes a random selection from an input array
 *
 * @return {*} - random choice from array
 */
function randChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}
exports.randChoice = randChoice;
function pluralize(word, number) {
    if (number > 1 || number === 0) {
        return word + 's';
    }
    else if (number === 1) {
        return word;
    }
    return -1;
}
exports.pluralize = pluralize;
var ETime;
(function (ETime) {
    ETime[ETime["Seconds"] = 0] = "Seconds";
    ETime[ETime["Minutes"] = 1] = "Minutes";
    ETime[ETime["Hours"] = 2] = "Hours";
    ETime[ETime["Days"] = 3] = "Days";
    ETime[ETime["Weeks"] = 4] = "Weeks";
    ETime[ETime["Months"] = 5] = "Months";
    ETime[ETime["Years"] = 6] = "Years";
})(ETime = exports.ETime || (exports.ETime = {}));
/*
export function resolveTime(duration : number) : string {

    let  milliseconds : number = parseInt((duration%1000)/100)
    const seconds : number = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;


}
*/ 
