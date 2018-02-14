const Nodesu = require('nodesu');
const config = require('../config0');

const api = new Nodesu.Client(config.osu.API_KEY);

exports.getPlayerData = function(name){
    return new Promise(function(resolve, reject){
        api.user.get(name, Nodesu.Mode.all).then(function(response){
            console.log(response);
            resolve(response);
        })
            .catch(err => {
                reject(err);
            });
    });
};

exports.getRecentGames = function (name){
    return new Promise(function(resolve, reject){
        api.getRecent(name).then(function(response){
            console.log(response);
        });
    });
};