import * as Discord from 'discord.js'
import * as dbg from "debug";
import {log} from "../Utility/Logging";

export const debug = {
    silly  : dbg('Bot:onChannelCreate:Silly'),
    info   : dbg('Bot:onChannelCreate:Info'),
    warning: dbg('Bot:onChannelCreate:Warning'),
    error  : dbg('Bot:onChannelCreate:Error')
};

export default function onChannelCreate(channel : Discord.Channel){
    if (channel instanceof Discord.TextChannel || channel instanceof Discord.VoiceChannel){
        const logsChannel : Discord.Channel = channel.guild.channels.find('name', 'logs');
        if (!logsChannel || logsChannel === undefined)
            return debug.info(`A new channel was created in ${channel.guild} but a logs channel was not found.`);
        let creator : string;
        channel.guild.fetchAuditLogs().then(audit => {
            creator = audit.entries.first().executor.username;

            log(channel.guild,
                `${creator} created a new ${channel.type} channel '${channel.name}'`)

        });
    }
}