import {Guild, Message} from "discord.js";
import {Database} from "../../database/Database";
import {debug} from '../../utility/Logging'
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {ICachedGuild} from "../../database/interface";

export default function getConfig(message : Message, db : Database) : void {
    const guild = message.guild;
    const cache : ICachedGuild | undefined = db.getGuild(guild);
    if (!cache) {
        debug.error(`Guild ${guild.name} was not found in cache.`);
        return undefined;
    }

    const welcome_channel = cache.welcome_channel ? `<#${cache.welcome_channel}>` : `Not set`;
    const logs_channel = cache.logs_channel ? `<#${cache.logs_channel}>` : `Not set`;
    const warnings_channel = cache.warnings_channel ? `<#${cache.warnings_channel}>` : `Not set`;

    let out : string = "";
    out += `\`Welcome channel\`: ${welcome_channel}\n`;
    out += `\`Logs channel\`: ${logs_channel}\n`;
    out += `\`Warnings channel\`: ${warnings_channel}`;

    safeSendMessage(message.channel, out);
}