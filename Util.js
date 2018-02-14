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
