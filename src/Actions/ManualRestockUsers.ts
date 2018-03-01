import * as Discord from 'discord.js'
import {Database} from "../database/Database";
import gb from "../misc/Globals";

export default function manualRestockUsers(message : Discord.Message, database : Database){
    if (message.author.id !== gb.ownerID) return;
    database.restockGuildMembers(message.guild);
}