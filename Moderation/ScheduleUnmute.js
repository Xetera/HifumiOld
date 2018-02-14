"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logging_1 = require("./../Logging");
function scheduleUnmute(member, time) {
    var muted = member.guild.roles.find('name', 'muted');
    if (!muted)
        return Logging_1.debug.warning("Could not schedule unmute for user " + member.user.username + ", missing 'muted' role.");
    setTimeout(function () {
        member.removeRole(muted);
    }, time);
}
exports.scheduleUnmute = scheduleUnmute;
