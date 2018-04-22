import * as Discord from 'discord.js'
import {Database} from "../database/Database";
import * as dbg from "debug";
import {default as gb, Instance} from "../misc/Globals";
import {TextChannel} from "discord.js";
import onGuildCreateEmbed from "../embeds/events/onGuildCreateEmbed";

export const debug = {
    silly  : dbg('Bot:onGuildCreate:Silly'),
    info   : dbg('Bot:onGuildCreate:Info'),
    warning: dbg('Bot:onGuildCreate:Warning'),
    error  : dbg('Bot:onGuildCreate:Error')
};
export default async function onGuildCreate(guild : Discord.Guild){
    await gb.instance.database.addGuild(guild);
    gb.instance.muteQueue.insertNewGuild(guild);
    gb.instance.trackList.insertNewGuild(guild);

    debug.info(`I was added to the server: ${guild.name} with ${guild.memberCount} members.`);
    const targetChannel = guild.systemChannel;
    let embed = onGuildCreateEmbed();

    if (targetChannel && targetChannel instanceof TextChannel){
        targetChannel.send(embed);
    }
}
