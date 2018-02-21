"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var dbg = require("debug");
var Errors_1 = require("../Interfaces/Errors");
var debug = {
    info: dbg('Bot:DeleteMessage:Info'),
    warning: dbg('Bot:DeleteMessage:Warning'),
    error: dbg('Bot:DeleteMessage:Error')
};
function safeDeleteMessage(message) {
    return new Promise(function (resolve) {
        message.delete().then(function () {
            resolve();
        }).catch(function (error) {
            if (error instanceof discord_js_1.DiscordAPIError) {
                if (error.message === Errors_1.APIErrors.MISSING_PERMISSIONS) {
                    debug.error("Could not delete message from " + message.author.username +
                        (" in " + message.guild.name + ", missing permissions."));
                }
                else {
                    debug.error(error);
                }
            }
            else {
                debug.error("Unexpected error while trying to delete message from " +
                    (message.author.username + " in " + message.guild.name + "."), error);
            }
            // we don't want to reject here because we're already handling everything here
        });
    });
}
exports.default = safeDeleteMessage;
