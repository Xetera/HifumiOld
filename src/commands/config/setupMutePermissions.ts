import {Message, Permissions, Role} from "discord.js";
import {checkMuteCoverage, checkMuteRoleExisting} from "./checkChannelPermissions";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {noMissingMuteOverwritesEmbed} from "../../embeds/commands/configEmbed/channelPermissionsCalculatorEmbed";

export default async function setupMutePermissions(message: Message){
    let role: Role | undefined = checkMuteRoleExisting(message);
    const coverage = checkMuteCoverage(message);
    if (role && coverage === 'all'){
        return void safeSendMessage(message.channel, noMissingMuteOverwritesEmbed(role.name));
    }
    else if (role && coverage === 'partial')
    console.log(coverage);
}
