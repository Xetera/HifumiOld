"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
/**
 *
 * @returns {number} - in milliseconds
 */
function getMuteDuration() {
    switch (exports.securityLevel) {
        case SecurityLevels.Dangerous: {
            return 0;
        }
        case SecurityLevels.Medium: {
            return 5000; // 5 sec
        }
        case SecurityLevels.High: {
            return 30000;
        }
    }
}
exports.getMuteDuration = getMuteDuration;
