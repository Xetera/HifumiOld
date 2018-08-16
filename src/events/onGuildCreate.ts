import * as Discord from 'discord.js'
import {gb} from "../misc/Globals";
import {debug} from "../utility/Logging";


export default async function onGuildCreate(guild : Discord.Guild, retry?: number) {
    const database = gb.database;
    /**
     * we don't want to check if it's ready because once we're in a guild
     * we need to be adding it to the database regardless. Even if it's
     * an outage it's fine because we're just upserting anyways
     */
    if (!database
        || !database.ready
        || gb.sleeping
        || !gb
        || !await gb.database.getGuildEnabled(guild.id) || !guild.available) {

        if (retry && retry > 10) {
            return debug.error(`Tried adding a guild ${guild.name}[${guild.id}] 10 times but failed`);
        }
        setTimeout(() => onGuildCreate(guild, retry !== undefined ? retry + 1 : 1), 10000);
        return;
    }


    await gb.database.addGuild(guild);
    await gb.database.addMembers(guild.members.array());

    gb.muteQueue.insertNewGuild(guild);
    gb.trackList.insertNewGuild(guild);
    debug.info(`I was added to the server: ${guild.name} with ${guild.memberCount} members.`);
}
