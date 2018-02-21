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
function safeMessageUser(user, message, reason) {
    var messageReason = reason ? "for reason: " + reason : "";
    return new Promise(function (resolve) {
        user.createDM().then(function (channel) {
            return channel.send(message);
        }).then(function (message) {
            debug.info("Messaged user " + user.username + " " + messageReason + ".");
            resolve();
        }).catch(function (error) {
            if (error instanceof discord_js_1.DiscordAPIError) {
                if (error.message === Errors_1.APIErrors.CANNOT_MESSAGE_USER) {
                    debug.info("Tried to message " + user.username + " but couldn't.");
                }
                else {
                    debug.error(error);
                }
            }
            else {
                debug.error("Unexpected error while trying to message  " +
                    (user.username + " " + reason + "."), error);
            }
            // we don't want to reject here because we're already handling everything here
        });
    });
}
exports.default = safeMessageUser;
