//"use strict";
const config = require('../config0.json');
const axios = require('axios');

const baseUserSearchURL = "https://api.brawlhalla.com/search?steamid=";

class Brawlhalla {
    constructor(id, name) {
        this.id = id;
        this.name = name;

    }

}

async function getUser(steam64) {
    let totalURL = baseUserSearchURL + steam64 +  "&" +  config.brawlhalla_api_key;

    console.log("Getting Brawlhalla ID from: " + totalURL);
    const response = await axios(totalURL);

    let brawlJSON = response.data;
    let id = brawlJSON.brawlhalla_id;
    let name = brawlJSON.name;
    return new Brawlhalla(id, name);

}


async function findUserData(id) {
    let URL = `https://api.brawlhalla.com/player/${id}/stats?${config.brawlhalla_api_key}`;
    console.log("Getting userData from: " + URL);
    const response = await axios(URL);
    //console.log(response.data);
    return response.data;
}

async function findRankedData(steamID) {
    let URL = `https://api.brawlhalla.com/player/${steamID}/ranked?${config.brawlhalla_api_key}`;

    console.log(`Getting ranked data from:  ${URL}`);
    const response = await axios(URL);
    //console.log(response.data)
    return response.data;
}

// how do I work with this mess that's going on

async function callData(steamID) {
    // steamID has to be string because of its size

    const userObj = await getUser(steamID);
    const playerData = await findUserData(userObj.id);
    const rankedData = await findRankedData(userObj.id);

    return [userObj, playerData, rankedData];
}

const id1 = "76561198071068533";

function titleCase(str) {
    //capitalizes every word of the string this.input
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

function getLegendData(array){
    let data = array[1];

    let legends = data['legends'];

    let legendStats = [];

    let amount;
    if (legends.length < 6){
        amount = legends.length;
    }
    else {
        amount = 6;
    }

    for (let i = 0; i < amount; i++) {
        let legend = legends;
        let legendName = titleCase(legend[i]['legend_name_key']);
        legendStats[i] = [legend[i]['level'], legendName, legend[i]['games'],
            legend[i]['wins'], legend[i]['kos']]

        //level, name, games, wins, KOs
    }

    legendStats = legendStats.sort(function (a, b) {
      return b[0] - a[0]
    });
    return legendStats;
}

function parsePlayerInfo(data){
    return data[0];
}

function parseGuildInfo(data){
    return data[1]['clan']
}


function parseRankedInfo(data){
    let noRanked = "No ranked games found";
    let dict = {};
    let ranked = data[2];
    let normal = data[1];

    dict['name'] = normal['name'];
    dict['rating'] = ranked['rating'] || noRanked;
    dict['peak_rating'] = ranked['peak_rating'] || noRanked;
    dict['tier'] = ranked['tier'] || noRanked;
    dict['games'] = normal['games'];
    dict['wins'] = normal['wins'];
    dict['level'] = normal['level'];
    return dict;
}

/*
callData(id1).then(function(res){
    console.log(parseRankedInfo(res));
});

*/
module.exports.callData = callData;
module.exports.findRankedData = findRankedData;
module.exports.getLegendData = getLegendData;
module.exports.parseGuildInfo = parseGuildInfo;
module.exports.parsePlayerInfo = parsePlayerInfo;
module.exports.parseRankedInfo = parseRankedInfo;