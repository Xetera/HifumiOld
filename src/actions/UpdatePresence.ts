import * as Discord from 'discord.js'
import {default as gb} from "../misc/Globals";
import {Guild} from "discord.js";
import {HifumiAPI} from "../API/hifumiAPI";

export default async function updatePresence(bot : Discord.Client) : Promise<void> {
    gb.allMembers = 0;
    const guilds = bot.guilds.array();
    for (let guild of guilds){
        // don't want to show Discord Bots server count on there
        if(guild.id !== '110373943822540800'){
            const g = await guild.fetchMembers();
            gb.allMembers += g.members.size;
        }
    }
    // HifumiAPI.postStats(bot, gb.allMembers, guilds.length);
    bot.user.setActivity(`out for ${gb.allMembers} users | $help`, {
        type: 'WATCHING'
    });
}
