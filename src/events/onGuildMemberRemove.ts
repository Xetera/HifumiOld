import * as Discord from "discord.js";
import { Message} from "discord.js";
import safeDeleteMessage from "../handlers/safe/SafeDeleteMessage";
import {LogManager} from "../handlers/logging/logManager";
import {debug} from "../utility/Logging";

import {Container} from "typescript-ioc";
import {IDatabase} from "../interfaces/injectables/datbase.interface";
import {IClient} from "../interfaces/injectables/client.interface";


export default async function onGuildMemberRemove(member : Discord.GuildMember) {
    // we will change this later to fetch from a Database instead of using a preset name

    const database: IDatabase = Container.get(IDatabase);
    const bot: IClient = Container.get(IClient);
    if (!member.guild.available
        || bot.sleeping
        || !database.ready
        || !await database.getGuildColumn(member.guild.id, 'enabled')){
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

    const welcomeMessage: Message | undefined = database.unCacheWelcomeMessage(member);
    if (welcomeMessage) {
        safeDeleteMessage(welcomeMessage);
    }

    if (isBan)
        return;

    LogManager.logMemberLeave(member);
}
