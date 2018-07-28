import * as Discord from 'discord.js'
import {debug} from "../utility/Logging";
import {Container} from "typescript-ioc";
import {IDatabase} from "../interfaces/injectables/datbase.interface";
import {IClient} from "../interfaces/injectables/client.interface";
import {IMuteQueue} from "../interfaces/injectables/muteQueue.interface";
import {ITracklist} from "../interfaces/injectables/tracklist.interface";

export default async function onGuildCreate(guild : Discord.Guild) {
    const database: IDatabase = Container.get(IDatabase);
    const bot: IClient = Container.get(IClient);
    const muteQueue: IMuteQueue = Container.get(IMuteQueue);
    const trackList: ITracklist = Container.get(ITracklist);

    /**
     * we don't want to check if it's ready because once we're in a guild
     * we need to be adding it to the database regardless. Even if it's
     * an outage it's fine because we're just upserting anyways
     */
    if (!database.ready
        || bot.sleeping
        || !await database.getGuildColumn(guild.id, 'enabled')
        || !guild.available) {
        return;
    }

    await database.addGuild(guild);
    await database.addMembers(guild.members.array());

    muteQueue.insertNewGuild(guild);
    trackList.insertNewGuild(guild);
    debug.info(`I was added to the server: ${guild.name} with ${guild.memberCount} members.`);
}
