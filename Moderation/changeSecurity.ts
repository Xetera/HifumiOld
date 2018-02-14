import * as Discord from 'discord.js'
import * as Settings from "../Settings";

export function changeSecurity(channel : Discord.TextChannel, args : String){
    let chosenLevel : String;
    if (!args.length){
        return channel.send(`The current security level is ${Settings.resolveSecurityLevel(Settings.securityLevel)}`)
    }
    else if (args.match(/high/i)){
        Settings.setSecurityLevel(Settings.SecurityLevels.High);
        chosenLevel = "High";
    }
    else if (args.match(/medium/i)){
        Settings.setSecurityLevel(Settings.SecurityLevels.Medium);
        chosenLevel = "Medium";
    }
    else if (args.match(/Dangerous/i)){
        Settings.setSecurityLevel(Settings.SecurityLevels.Dangerous);
        chosenLevel = "Dangerous";
    }
    else {
        return channel.send(`${args} is not a security level.`).then((msg : any) => {
            msg.delete(7 * 1000); // otherwise delete gives us an error
        })
    }
    return channel.send(`The security level is now ${chosenLevel}.`).then((msg : any) => {
        msg.delete(7 * 1000);
    });
}