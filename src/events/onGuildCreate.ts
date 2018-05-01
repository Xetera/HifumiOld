import * as Discord from 'discord.js'
import {Database} from "../database/Database";
import * as dbg from "debug";
import {default as gb, Instance} from "../misc/Globals";
import {TextChannel} from "discord.js";
import onGuildCreateEmbed from "../embeds/events/onGuildCreateEmbed";
import {debug} from "../utility/Logging";


export default async function onGuildCreate(guild : Discord.Guild){
    if (gb.instance.database.ready || !await gb.instance.database.getGuildEnabled(guild.id)){
        return;
    }

    await gb.instance.database.addGuild(guild);
    await gb.instance.database.addMembers(guild.members.array());

    gb.instance.muteQueue.insertNewGuild(guild);
    gb.instance.trackList.insertNewGuild(guild);
    debug.info(`I was added to the server: ${guild.name} with ${guild.memberCount} members.`);
    const targetChannel = guild.systemChannel;
    let embed = onGuildCreateEmbed();

    if (targetChannel && targetChannel instanceof TextChannel){
        targetChannel.send(embed);
    }
}
