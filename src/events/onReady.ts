import * as Discord from'discord.js'
import {debug, startupTable} from '../utility/Logging'
import {default as gb, emojiName, Instance} from "../misc/Globals";
import {Environments} from "./systemStartup";
import {Emoji} from "discord.js";
const cli = require('heroku-cli-util');

// returning owner id at the end
export default function onReady( instance : Instance) : Promise<string> {
    const bot = instance.bot;
    const database = instance.database;
    gb.allMembers = 0;
    debug.info(`${bot.user.username} is fully online.`, "Ready");

    return bot.generateInvite().then(link => {
        debug.info(`Invite link: ${link}`);

        let guilds = bot.guilds.array();
        let startupGuild = [];

        for (let guild of guilds) {
            gb.allMembers += guild.members.array().length;
            startupGuild.push({
                name: guild.name,
                members: guild.members.array().length,
                channels: guild.channels.array().length
            });
        }

        startupTable(startupGuild);
        return bot;
        }).then((bot : Discord.Client) => {
            setGlobals(bot);
            instance.database.doPrep();
            return bot.user.setActivity(`out for ${gb.allMembers} users`, {
            type: 'WATCHING'
        }).then(() => {
            return bot.fetchApplication();
        }).then((app : Discord.OAuth2Application)=> {
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
    setEmojis();
}

function setEmojis(){
    gb.emojis = new Map<emojiName, Emoji>();
    gb.emojiGuild.emojis.array().forEach(function (emoji) {
        gb.emojis.set(emoji.name, emoji);
    })
}