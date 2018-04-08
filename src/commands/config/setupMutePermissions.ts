import createMuteRoleEmbed from "../../embeds/commands/configEmbed/createMuteRoleEmbed";
import {Message, Permissions, Role} from "discord.js";
import {checkMuteCoverage, checkMuteRoleExisting} from "./checkChannelPermissions";
import createMuteRole from "./createMuteRole";
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
    /*
    if (!role)
        role = await createMuteRole(message);

    const channels = message.guild.channels.array().filter(channel => channel.type === 'text');
    const override: { [perm: string]: boolean } = {};
    const permissionKeys = Object.keys(Permissions.FLAGS);
    for (let i in permissionKeys) {
        override[permissionKeys[i]] = false;
    }
    override['READ_MESSAGE_HISTORY'] = true;
    override['READ_MESSAGES'] = true;
    let channelChangeCount = 0;
    let categoryChangeCount = 0;
    const categories: string[] = [];
    for (let channel of channels) {
        if (channel.parent) {
            if (!categories.includes(channel.parent.name)) {
                channel.parent.overwritePermissions(role, override);
                categories.push(channel.parent.name);
                categoryChangeCount++;
            }
            continue;
        }
        channel.overwritePermissions(role, override).catch(console.log);
        channelChangeCount++;
    }
    const embed = createMuteRoleEmbed(role, channelChangeCount, categories.length);
    return message.channel.send(embed);*/
}
