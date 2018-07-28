import * as Discord from "discord.js";
import gb from "../misc/Globals";
import { Message} from "discord.js";
import safeDeleteMessage from "../handlers/safe/SafeDeleteMessage";
import {LogManager} from "../handlers/logging/logManager";
import {debug} from "../utility/Logging";


export default async function onGuildMemberRemove(member : Discord.GuildMember) {
    // we will change this later to fetch from a Database instead of using a preset name

    if (!member.guild.available
        || gb.sleeping
        || !gb.instance.database.ready
        || !await gb.instance.database.getGuildEnabled(member.guild.id)){
        return;
    }
    let logs;
    let isBan;
    try {
        logs =  await member.guild.fetchAuditLogs();
    }
    catch (e) {
        debug.error(`Error while fetching audit logs on member leave`, `onGuildMemberRemove`);

    }

    if (logs)
        isBan = logs.entries.first().action === 'MEMBER_BAN_ADD';

    const welcomeMessage: Message | undefined = gb.instance.database.unCacheWelcomeMessage(member);
    if (welcomeMessage) {
        safeDeleteMessage(welcomeMessage);
    }

    if (isBan)
        return;

    LogManager.logMemberLeave(member);
}
