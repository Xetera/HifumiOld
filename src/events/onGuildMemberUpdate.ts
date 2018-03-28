import {GuildMember, Role} from "discord.js";
import {subtractArrays} from "../utility/Util";
import gb from "../misc/Globals";

/**
 *
 */
export default function onGuildMemberUpdate(oldMember : GuildMember, newMember : GuildMember){
    const oldRoles = oldMember.roles.array().filter(role => !role.hasPermission('SEND_MESSAGES'));
    const newRoles = newMember.roles.array().filter(role => !role.hasPermission('SEND_MESSAGES'));
    const unmuted: Role[] | undefined = subtractArrays(oldRoles, newRoles);

    if (!unmuted)
        return;

    const member = gb.instance.muteQueue.getUser(oldMember.guild, oldMember);
    // here we know that the user was prematurely muted
    if (!member)
        return;

}