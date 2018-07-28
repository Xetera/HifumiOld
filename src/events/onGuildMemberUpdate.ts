import {GuildMember} from "discord.js";

/**
 *
 */
export default async function onGuildMemberUpdate(oldMember : GuildMember, newMember : GuildMember){
    /*
    if (!newMember.guild.available || !await gb.instance.database.getGuildEnabled(oldMember.guild.id)){
        return;
    }

    const oldRoles = oldMember.roles.array().filter(role => !role.hasPermission('SEND_MESSAGES'));
    const newRoles = newMember.roles.array().filter(role => !role.hasPermission('SEND_MESSAGES'));
    const unmuted: Role[] | undefined = subtractArrays(oldRoles, newRoles);

    if (!unmuted)
        return;

    const member = gb.instance.muteQueue.getUser(oldMember.guild, oldMember);
    // here we know that the user was prematurely muted
    if (!member)
        return;
    */
}
