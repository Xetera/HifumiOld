import * as Discord from 'discord.js'
import {Database} from "../database/Database";
import * as dbg from "debug";
import {Instance} from "../misc/Globals";
export const debug = {
    silly  : dbg('Bot:onGuildCreate:Silly'),
    info   : dbg('Bot:onGuildCreate:Info'),
    warning: dbg('Bot:onGuildCreate:Warning'),
    error  : dbg('Bot:onGuildCreate:Error')
};
export default function onGuildCreate(guild : Discord.Guild, instance : Instance){
    instance.muteQueue.insertNewGuild(guild);
    instance.database.insertNewGuild(guild);

    debug.info(`I was added to the server: ${guild.name} with ${guild.memberCount} members.`);
}