import * as Discord from "discord.js";
import * as dbg from "debug";
import gb from "../misc/Globals";
import {GuildAuditLogs, Message} from "discord.js";
import safeDeleteMessage from "../handlers/safe/SafeDeleteMessage";
import {LogManager} from "../handlers/logging/logManager";

export const debug = {
    silly  : dbg('Bot:onGuildMemberRemove:Silly'),
    info   : dbg('Bot:onGuildMemberRemove:Info'),
    warning: dbg('Bot:onGuildMemberRemove:Warning'),
    error  : dbg('Bot:onGuildMemberRemove:Error')
};

export default  function onGuildMemberRemove(member : Discord.GuildMember) {
    // we will change this later to fetch from a database instead of using a preset name
    return member.guild.fetchAuditLogs().then((logs: GuildAuditLogs)=> {
        return logs.entries.first().action === 'MEMBER_BAN_ADD';
    }).then((isBan: boolean) => {
        const welcomeMessage: Message | undefined = gb.instance.database.uncacheWelcomeMessage(member);
        if (!welcomeMessage) {
            debug.error(`Could not delete the message for user ${member.user.username}`);
        }
        else {
            safeDeleteMessage(welcomeMessage);
        }

        if (isBan)
            return;
        LogManager.logMemberLeave(member);
    })
}