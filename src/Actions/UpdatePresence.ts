import * as Discord from 'discord.js'
import {default as gb} from "../Misc/Globals";

export default function updatePresence(bot : Discord.Client) : void {
    gb.allMembers = 0;
    bot.guilds.array().forEach(function (value, index, array) {
        gb.allMembers += value.memberCount;
    });

    bot.user.setActivity(`out for ${gb.allMembers} users`, {
        type: 'WATCHING'
    });
}
