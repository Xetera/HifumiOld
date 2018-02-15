"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Logging_1 = require("../Logging");
var discord_js_1 = require("discord.js");
var MutedUser = /** @class */ (function () {
    function MutedUser(member, role, unmuteDate) {
        this.name = member.nickname || member.user.username; // this can change but we don't care
        this.muteDate = new Date();
        this.unmuteDate = unmuteDate;
        this.role = role;
    }
    return MutedUser;
}());
var MuteQueue = /** @class */ (function () {
    function MuteQueue() {
        this.queue = [];
    }
    MuteQueue.prototype.add = function (user, role, unmuteDate) {
        this.queue.push(new MutedUser(user, role, unmuteDate));
        this.scheduleUnmute(user);
    };
    MuteQueue.prototype.getMutedUserCount = function () {
        return this.queue.length;
    };
    MuteQueue.prototype.scheduleUnmute = function (user) {
        var _this = this;
        var index = this.queue.findIndex(function (usr) { return usr.member.id === user.id; });
        var mutedGuildMember = this.queue[index];
        if (mutedGuildMember === undefined)
            return Logging_1.debug.error('Tried to shift an empty MuteQueue.');
        var timeDelta = mutedGuildMember.unmuteDate.getTime() - Date.now();
        Logging_1.debug.silly(timeDelta + " seconds recorded as timeDelta for " + mutedGuildMember.name);
        setTimeout(function () {
            return __awaiter(this, void 0, void 0, function () {
                var index, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            index = _this.queue.findIndex(function (usr) { return usr.member.id === user.id; });
                            if (!mutedGuildMember.role) {
                                Logging_1.debug.warning("Could not schedule an unmute for user " + mutedGuildMember.name + ", missing 'muted' role.");
                                return [2 /*return*/, _this.queue.splice(index, 1)];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, mutedGuildMember.member.removeRole(mutedGuildMember.role, "End of " + timeDelta / 1000 + " second mute.")];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            if (error_1 instanceof discord_js_1.DiscordAPIError) {
                                Logging_1.debug.error("Tried to unmute " + mutedGuildMember.name + " but they were already unmuted.", error_1);
                                return [2 /*return*/, _this.queue.splice(index, 1)];
                            }
                            return [3 /*break*/, 4];
                        case 4:
                            _this.queue.splice(index, 1);
                            Logging_1.debug.info(mutedGuildMember.name + " in " + mutedGuildMember.member.guild.name + " was unmuted after " + timeDelta + " seconds of timeout.");
                            return [2 /*return*/];
                    }
                });
            });
        }, timeDelta);
    };
    return MuteQueue;
}());
exports.MuteQueue = MuteQueue;
