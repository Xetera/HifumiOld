"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Settings = require("../../Settings");
function changeSecurity(channel, args) {
    var chosenLevel;
    if (!args.length) {
        return channel.send("The current security level is " + Settings.resolveSecurityLevel(Settings.securityLevel));
    }
    else if (args.match(/high/i)) {
        Settings.setSecurityLevel(Settings.SecurityLevels.High);
        chosenLevel = "High";
    }
    else if (args.match(/medium/i)) {
        Settings.setSecurityLevel(Settings.SecurityLevels.Medium);
        chosenLevel = "Medium";
    }
    else if (args.match(/Dangerous/i)) {
        Settings.setSecurityLevel(Settings.SecurityLevels.Dangerous);
        chosenLevel = "Dangerous";
    }
    else {
        return channel.send(args + " is not a security level.").then(function (msg) {
            msg.delete(7 * 1000); // otherwise delete gives us an error
        });
    }
    return channel.send("The security level is now " + chosenLevel + ".").then(function (msg) {
        msg.delete(7 * 1000);
    });
}
exports.changeSecurity = changeSecurity;
