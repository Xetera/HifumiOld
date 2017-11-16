const request = require('request');
const config = require('../../config0.json');

const baseUserSearchURL = "https://api.brawlhalla.com/search?steamid=";

class Brawlhalla {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

}

function getUser(steam64 ,callback) {
    console.log("first function runing.");
    let totalURL = baseUserSearchURL + steam64 + config.brawlhalla_api_key;
    console.log(totalURL);
    request.get(totalURL, (error, response, body) =>
    {
        if (error) {
            console.log('GetUser.error:', error);
            return false
        }
        console.log("GetUser.statusCode:", response && response.statusCode);
        let brawlJSON = JSON.parse(body);
       // console.log('body:', brawlJSON);
        let id = brawlJSON.brawlhalla_id;
        let name = brawlJSON.name;
        let user = new Brawlhalla(id, name);
        console.log(user);
        callback(user);
    })

}


function findUserData(userObject, callback) {
    console.log('second func running');
    URL = `https://api.brawlhalla.com/player/${userObject.id}/stats?`;
    console.log("URL: " + URL);
    request.get(URL  + config.brawlhalla_api_key, (error, response, body) => {
        let JSONresponse = JSON.parse(body);
        if (error){
            console.log('findUserData.error: ' + error);
        }
        console.log("findUserData.response: " + response && response.statusCode);
        //console.log(JSONresponse);
        if (error) {
            callback(error)
        }
        callback(JSONresponse);

    })
}

function findRankedData(steamID, callback) {
    getUser(steamID, (trace) => {
    let URL = `https://api.brawlhalla.com/player/${trace.id}/ranked`;
    request.get(URL + config.brawlhalla_api_key, (error, response, body) => {
        let JSONresponse = JSON.parse(body);
        if (error){
            console.log('findUserData.error: ' + error);
        }
        console.log("findUserData.response: " + response && response.statusCode);
        //console.log(JSONresponse);
        if (error) {
            callback(error)
        }
        callback(JSONresponse);
    })
    })
}

// how do I work with this mess that's going on
function callData(steamID, trace) {
    getUser(steamID, (callback) => {
        findUserData(callback, (response) => {
            callback.userdata = response;
            console.log(callback.userdata);
            console.log("Brawlhalla user data successfully got");
            trace(response);
        });
    });
}

function callRanked(brawlhallaID, trace) {

}

findRankedData(config.brawlhalla_ID, (trace) => {
    console.log(trace);
});


module.exports.callData = callData;
module.exports.findRankedData = findRankedData;