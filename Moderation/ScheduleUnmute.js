"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function scheduleUnmute(member, time) {
    var mutedMemberName = member.nickname || member.user.username;
    var muted = member.guild.roles.find('name', 'muted');
}
exports.scheduleUnmute = scheduleUnmute;
