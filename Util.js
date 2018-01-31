/**
 * Returns a random selection from a range of numbers.
 *
 * @param {number} [min=0] - Optional start range.
 * @param {number} range - Max range.
 * @returns {number} - Random choice within range
 */
exports.randRange = function(min=0, range){
    if (!min){
        return Math.floor(Math.random() * range);
    }
    return Math.floor(Math.random() * (min - range + 1)) + min
};


exports.randBool = function(){
    return Math.random () >= 0.5;
};

/**
 * Makes a random selection from an input array
 *
 * @return {*} - random choice from array
 */
exports.randChoice = function(array){
    return array[Math.floor(Math.random() * array.length)];
}

exports.pluralize = function(word, number){
    if (number > 1 || number === 0){
        return word + 's';
    }
    else if (number === 1){
        return word;
    }
    return -1;
};
