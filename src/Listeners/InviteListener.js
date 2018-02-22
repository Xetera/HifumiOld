"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Regex_1 = require("./Regex");
var onMessage_1 = require("../Events/onMessage");
var Settings_1 = require("../Utility/Settings");
var SafeDeleteMessage_1 = require("../Handlers/SafeDeleteMessage");
var SafeMessageUser_1 = require("../Handlers/SafeMessageUser");
var Replies_1 = require("../Handlers/Replies");
function inviteListener(message) {
    var sender = message.member.nickname || message.author.username;
    if (message.content.match(Regex_1.discordInviteRegex)) {
        onMessage_1.debug.warning(sender + " in " + message.guild + " sent an invite link.");
        if (Settings_1.securityLevel === Settings_1.SecurityLevels.Dangerous)
            return;
        SafeDeleteMessage_1.default(message).then(function () {
            onMessage_1.debug.info("Deleted invite link from " + sender);
            SafeMessageUser_1.default(message.author, Replies_1.bannedForSpammingInvites(message.guild), "spamming");
        });
    }
}
exports.default = inviteListener;
