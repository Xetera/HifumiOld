import * as Discord from 'discord.js'
import {gb} from "../misc/Globals";
import {Environments} from "../events/systemStartup";
import * as DBLAPI from "dblapi.js";
import {debug} from "../utility/Logging";
import {distributionStat, incrementStat} from "../handlers/logging/datadog";

// @ts-ignore
let dbl: DBLAPI;
if (gb.ENV === Environments.Production) {
    if (!process.env.DBL_TOKEN) {
        debug.error(
            `No dbl token found in production mode!`
        );
    } else {
        dbl = new DBLAPI(process.env.DBL_TOKEN!, gb.bot);
    }
}

export default async function updatePresence(bot : Discord.Client) : Promise<void> {
    gb.allMembers = bot.guilds.reduce((users, guild ) => users + guild.memberCount, 0);
    const servers = bot.guilds.size;
    incrementStat(`hifumi.client.presence_updates`);
    distributionStat('hifumi.client.member_count', gb.allMembers);
    distributionStat('hifumi.client.guild_count', servers);
    //HifumiAPI.postStats(bot, gb.allMembers, guilds.length);
    bot.user.setActivity(`out for ${gb.allMembers} users | $help`, {
        type: 'WATCHING'
    });
}
