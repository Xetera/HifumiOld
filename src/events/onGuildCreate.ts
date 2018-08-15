import * as Discord from 'discord.js'
import {gb} from "../misc/Globals";
import {debug} from "../utility/Logging";


export default async function onGuildCreate(guild : Discord.Guild) {
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
        return;
    }


    await gb.database.addGuild(guild);
    await gb.database.addMembers(guild.members.array());

    gb.muteQueue.insertNewGuild(guild);
    gb.trackList.insertNewGuild(guild);
    debug.info(`I was added to the server: ${guild.name} with ${guild.memberCount} members.`);
}
