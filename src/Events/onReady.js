"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logging_1 = require("../Utility/Logging");
function onReady(bot) {
    Logging_1.debug.info(bot.user.username + " is fully online.");
    bot.generateInvite().then(function (link) {
        Logging_1.debug.info("Invite link: " + link);
        var guilds = bot.guilds.array();
        var guildMessage = "Guilds: " + guilds.length + "\n-----------------------------\n";
        for (var _i = 0, guilds_1 = guilds; _i < guilds_1.length; _i++) {
            var guild = guilds_1[_i];
            guildMessage += guild.name + ": " + guild.members.array().length + " members\n";
        }
        Logging_1.debug.info(guildMessage);
    });
}
exports.default = onReady;
