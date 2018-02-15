"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Moment = require("moment");
var SecurityLevels;
(function (SecurityLevels) {
    SecurityLevels[SecurityLevels["Dangerous"] = 0] = "Dangerous";
    SecurityLevels[SecurityLevels["Medium"] = 1] = "Medium";
    SecurityLevels[SecurityLevels["High"] = 2] = "High";
})(SecurityLevels = exports.SecurityLevels || (exports.SecurityLevels = {}));
function resolveSecurityLevel(security) {
    if (security === SecurityLevels.Dangerous)
        return "Dangerous";
    else if (security === SecurityLevels.Medium)
        return "Medium";
    else if (security === SecurityLevels.High)
        return "High";
    else
        throw new TypeError(security + " is not a valid SecurityLevel");
}
exports.resolveSecurityLevel = resolveSecurityLevel;
exports.securityLevel = SecurityLevels.Medium;
function setSecurityLevel(level) {
    exports.securityLevel = level;
}
exports.setSecurityLevel = setSecurityLevel;
/**
 *
 * @returns {number} - number of messages the bot tolerates before
 */
function getSpamTolerance() {
    switch (exports.securityLevel) {
        case SecurityLevels.Dangerous: {
            return 0;
        }
        case SecurityLevels.Medium: {
            return 6;
        }
        case SecurityLevels.High: {
            return 5;
        }
    }
}
exports.getSpamTolerance = getSpamTolerance;
var DurationSettings;
(function (DurationSettings) {
    DurationSettings[DurationSettings["GET_SECONDS"] = 0] = "GET_SECONDS";
})(DurationSettings = exports.DurationSettings || (exports.DurationSettings = {}));
var DANGEROUS_DURATION = 0;
var MEDIUM_DURATION = 5;
var HIGH_DURATION = 5;
function getMuteDate() {
    switch (exports.securityLevel) {
        case SecurityLevels.Dangerous: {
            return Moment(Date.now()).toDate();
        }
        case SecurityLevels.Medium: {
            var date = Moment(new Date()).add(MEDIUM_DURATION, 's').toDate();
            return date; // 5 sec
        }
        case SecurityLevels.High: {
            return Moment(new Date()).add(HIGH_DURATION, 's').toDate(); // update later
        }
    }
}
exports.getMuteDate = getMuteDate;
function getMuteTime() {
    switch (exports.securityLevel) {
        case SecurityLevels.Dangerous: {
            return DANGEROUS_DURATION;
        }
        case SecurityLevels.Medium: {
            return MEDIUM_DURATION; // 5 sec
        }
        case SecurityLevels.High: {
            return HIGH_DURATION;
        }
    }
}
exports.getMuteTime = getMuteTime;
