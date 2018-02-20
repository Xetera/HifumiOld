"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = require("discord.js");
var Logging_1 = require("../../Utility/Logging");
function changeName(me, name) {
    var oldName = me.username;
    return new Promise(function (resolve, reject) {
        try {
            me.setUsername(name).then(function (response) {
                Logging_1.debug.info("Changed my name from " + oldName + " to " + response.username + ".");
                resolve();
            });
        }
        catch (err) {
            if (err instanceof Discord.DiscordAPIError) {
                Logging_1.debug.error("API error when trying to change my own username.", err);
                reject(err);
            }
        }
    });
}
exports.default = changeName;
