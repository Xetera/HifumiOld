"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dbg = require("debug");
var log = dbg('Bot: Ready');
function onReady(bot) {
    log(bot.user.username + " is ready!");
    bot.generateInvite().then(function (link) {
        log("Invite link: " + link);
        var guilds = bot.guilds.array();
        var guildMessage = "Guilds: " + guilds.length + "\n-----------------------------\n";
        for (var _i = 0, guilds_1 = guilds; _i < guilds_1.length; _i++) {
            var guild = guilds_1[_i];
            guildMessage += guild.name + ": " + guild.members.array().length + " members\n";
        }
        log(guildMessage);
    });
}
exports.default = onReady;
