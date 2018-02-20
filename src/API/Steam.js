let Steam = require("API/Steam"),
    csgo = require("csgo"),
    bot = new Steam.SteamClient(),
    config = require('../config0.json'),
    steamUser = new Steam.SteamUser(bot),
    steamGC = new Steam.SteamGameCoordinator(bot, 730),
    CSGO = new csgo.CSGOClient(steamUser, steamGC, false);

function initsteam() {
    bot.connect();
    bot.on("connected", () => {
        steamUser.logOn({
            "account_name": config.steamUsername,
            "password": config.steamPassword
        });
    });

    bot.on('loggedOn', (details) => {
        if (details['eresult'] == 1) {
            console.log("Logged into Steam as " + bot.steamID.getSteam3RenderedID());
            bot.setPersona(SteamUser.EPersonaState.Online);
        }
        else {
            console.log("There was an error");
            console.error(error);
        }

})
}
function launchcsgo()  {
    //bot.gamesPlayed(730);
    console.log("launched CSGO.");
    try{
        CSGO.launch();
    } catch (err) {
        console.error(err);
    }

    CSGO.on("unhandled", function(message) {
        console.log("Unhandled msg");
        console.log(message);
    });
}

function requestPlayerStats (steam64) {
    console.log("1");
    CSGO.playerProfileRequest(CSGO.ToAccountID(steam64));
    console.log("2");
    try{
        CSGO.on("playerProfile", async(profile) => {
            console.log("3");
            console.log("Profile");
            console.log("Player Rank: " + CSGO.Rank.getString(profile.account_profiles[0].ranking.rank_id))
            console.log(JSON.stringify(profile, null, 2));
            console.log("LOGGED");
        });
    } catch (err) {
        console.log(err);
    }
    console.log("end of request.")

};
function test() {
    console.log("test");
}



module.exports.launchcsgo = launchcsgo;
module.exports.initsteam = initsteam;
module.exports.requestPlayerStats = requestPlayerStats;
module.exports.test = test;
