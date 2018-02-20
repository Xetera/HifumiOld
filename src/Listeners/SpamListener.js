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
var Discord = require("discord.js");
var Moment = require("moment");
var Settings_1 = require("../../Settings");
var MuteUser_1 = require("../Moderation/MuteUser");
var Logging_1 = require("../../Logging");
function checkForSpam(message, queue) {
    return __awaiter(this, void 0, void 0, function () {
        var channel, author_1, threshold_1, messages, userMessages, tolerance, deletedMessages, deletedMessagesCount, muteDuration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(message.channel instanceof Discord.TextChannel)) return [3 /*break*/, 7];
                    channel = message.channel;
                    author_1 = message.author;
                    threshold_1 = Moment(new Date()).subtract(5, 's').toDate();
                    return [4 /*yield*/, channel.fetchMessages({ limit: 20 })];
                case 1:
                    messages = _a.sent();
                    userMessages = messages.filter(function (msg) {
                        return msg.author.id === author_1.id && msg.createdAt > threshold_1;
                    } // get messages sent within the last 5s
                    );
                    tolerance = Settings_1.getSpamTolerance();
                    // user is already muted
                    if (message.member.roles.find('name', 'muted'))
                        return [2 /*return*/];
                    if (!(userMessages.array().length > tolerance)) return [3 /*break*/, 7];
                    deletedMessages = void 0;
                    deletedMessagesCount = void 0;
                    if (!(Settings_1.securityLevel === Settings_1.SecurityLevels.Medium)) return [3 /*break*/, 3];
                    return [4 /*yield*/, message.channel.bulkDelete(userMessages)];
                case 2:
                    deletedMessages = _a.sent();
                    return [3 /*break*/, 6];
                case 3:
                    if (!(Settings_1.securityLevel === Settings_1.SecurityLevels.High)) return [3 /*break*/, 5];
                    return [4 /*yield*/, message.channel.bulkDelete(messages.filter(function (msg) { return msg.id === author_1.id; }))];
                case 4:
                    deletedMessages = _a.sent();
                    return [3 /*break*/, 6];
                case 5: return [2 /*return*/];
                case 6:
                    deletedMessagesCount = deletedMessages.array().length;
                    Logging_1.debug.info("Deleted " + deletedMessagesCount + " messages from spammer [" + author_1.username + "]");
                    muteDuration = Settings_1.getMuteDate();
                    MuteUser_1.muteUser(message.member, Settings_1.getMuteDate(), queue);
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.checkForSpam = checkForSpam;
