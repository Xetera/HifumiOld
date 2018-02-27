import * as Discord from 'discord.js'
import {Database} from "../Database/Database";

export default function manualRestockUsers(guild : Discord.Guild, database : Database){
    database.insertNewGuild(guild);
}