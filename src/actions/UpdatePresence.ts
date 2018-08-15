import * as Discord from 'discord.js'
import {gb} from "../misc/Globals";
import {Environments} from "../events/systemStartup";
import * as DBLAPI from "dblapi.js";
import {debug} from "../utility/Logging";
import {incrementStat} from "../handlers/logging/datadog";

// @ts-ignore
let dbl: DBLAPI;
if (gb.ENV === Environments.Production) {
    if (!process.env.DBL_TOKEN) {
        debug.error(
            `No dbl token found in production mode!`
        );
    } else {
        dbl = new DBLAPI(process.env.DBL_TOKEN, gb.bot);
    }
}

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
    incrementStat(`hifumi.client.presence_updates`);
    //HifumiAPI.postStats(bot, gb.allMembers, guilds.length);
    bot.user.setActivity(`out for ${gb.allMembers} users | $help`, {
        type: 'WATCHING'
    });
}
