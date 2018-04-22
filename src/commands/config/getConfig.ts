import {Message} from "discord.js";
import {Database} from "../../database/Database";

import {debug} from '../../utility/Logging'
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import gb from "../../misc/Globals";
import {Guild} from "../../database/models/guild";

export default async function getConfig(message : Message, db : Database) {
    const guild = message.guild;
    const cache: Guild = await gb.instance.database.getGuild(guild.id);
    if (!cache) {
        debug.error(`Guild ${guild.name} was not found in cache.`);
        return undefined;
    }

    const welcome_channel = cache.welcome_channel ? `<#${cache.welcome_channel}>` : `Not set`;
    const logs_channel = cache.logs_channel ? `<#${cache.logs_channel}>` : `Not set`;
    const warnings_channel = cache.warnings_channel ? `<#${cache.warnings_channel}>` : `Not set`;
    const chat_channel = cache.chat_channel ? `<#${cache.chat_channel}>` : 'Not set';

    let out : string = "";
    out += `**Welcome channel**: ${welcome_channel}\n`;
    out += `**Logs channel**: ${logs_channel}\n`;
    out += `**Warnings channel**: ${warnings_channel}\n`;
    out += `**Chat Channel**: ${chat_channel}\n`;
    out += `**Command Hints**: ${cache.hints ? 'on' : 'off'}\n`;
    out += `**Invite Protection** ${cache.allows_invites ? 'off' : 'on'}`;
    safeSendMessage(message.channel, out);
}
