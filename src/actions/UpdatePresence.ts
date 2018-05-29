import * as Discord from 'discord.js'
import {default as gb} from "../misc/Globals";
import {Guild} from "discord.js";

export default async function updatePresence(bot : Discord.Client) : Promise<void> {
    gb.allMembers = 0;
    for (let guild of bot.guilds.array()){
        // don't want to show Discord Bots server count on there
        if(guild.id !== '110373943822540800'){
            const g = await guild.fetchMembers();
            gb.allMembers += g.members.array().length;
        }
    }
    
    bot.user.setActivity(`out for ${gb.allMembers} users | $help`, {
        type: 'WATCHING'
    });
}
