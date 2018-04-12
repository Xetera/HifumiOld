import * as Discord from'discord.js'
import {debug, startupTable} from '../utility/Logging'
import {default as gb, emojiName, Instance} from "../misc/Globals";
import {Environments} from "./systemStartup";
import {Emoji} from "discord.js";
import updatePresence from "../actions/UpdatePresence";
const cli = require('heroku-cli-util');

// returning owner id at the end
export default function onReady( instance : Instance) : Promise<string> {
    const bot = instance.bot;
    const database = instance.database;
    gb.allMembers = 0;

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
            instance.trackList.initializeGuilds();
            return updatePresence(bot);
        }).then(() => {
            return bot.fetchApplication();
        }).then((app : Discord.OAuth2Application)=> {
            debug.info(`${bot.user.username} is fully online.`, "Ready");
            return app.owner.id;
        });
}

function setGlobals(bot : Discord.Client){
    if (gb.ENV === Environments.Live){
        try{
            gb.emojiGuild = bot.guilds.find('id', process.env.EMOJI_GUILD);
        }
        catch {}

    }
    else {
        try {
            gb.emojiGuild = bot.guilds.find('id', require('../../config0.json').EMOJI_GUILD);
        }
        catch {}
    }
    setEmojis();
}

function setEmojis(){
    gb.emojis = new Map<emojiName, Emoji>();
    if (gb.emojiGuild)
        gb.emojiGuild.emojis.array().forEach(function (emoji) {
            gb.emojis.set(emoji.name, emoji);
        })
}
