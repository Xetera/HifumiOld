"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = require("discord.js");
var Logging_1 = require("../../Utility/Logging");
function changePicture(me, URL) {
    return new Promise(function (resolve, reject) {
        try {
            me.setAvatar(URL).then(function (response) {
                Logging_1.debug.info(response.username + " avatar successfully changed!.");
                resolve();
            });
        }
        catch (err) {
            if (err instanceof Discord.DiscordAPIError) {
                Logging_1.debug.error("API error when trying to change my own avatar picture.", err);
                reject(err);
            }
        }
    });
}
exports.default = changePicture;
