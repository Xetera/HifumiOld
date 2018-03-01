import * as Discord from'discord.js'
import {debug} from '../utility/Logging'
import {default as gb, Instance} from "../misc/Globals";
import {Environments} from "./systemStartup";



// returning owner id at the end


export default function onReady( instance : Instance) : Promise<string> {
    const bot = instance.bot;
    const database = instance.database;
    gb.allMembers = 0;
    debug.info(`${bot.user.username} is fully online.`);

    return bot.generateInvite().then(link => {
        debug.info(`Invite link: ${link}`);

        let guilds = bot.guilds.array();
        let guildMessage = `Guilds: ${guilds.length}\n-----------------------------\n`;
        for (let guild of guilds) {
            gb.allMembers += guild.members.array().length;
            guildMessage += `[${guild.name}]: ${guild.members.array().length} members\n`;
        }

        debug.info(guildMessage);
        return bot;

        }).then((bot) => {
            setGlobals(bot);
            return bot.user.setActivity(`out for ${gb.allMembers} users`, {
            type: 'WATCHING'
        }).then(() => {
            return bot.fetchApplication();
        }).then(app => {
            return app.owner.id;
        });
    });
}

function setGlobals(bot : Discord.Client){
    if (gb.ENV === Environments.Live){
        gb.emojiGuild = bot.guilds.find('id', process.env.EMOJI_GUILD);
    }
    else {
        gb.emojiGuild = bot.guilds.find('id', require('../../config0.json').EMOJI_GUILD);
    }
}