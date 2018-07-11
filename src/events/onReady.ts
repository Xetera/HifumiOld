import * as Discord from'discord.js'
import {debug, startupTable} from '../utility/Logging'
import {default as gb, emojiName, Instance} from "../misc/Globals";
import {Environments} from "./systemStartup";
import {Client, Emoji, Message} from "discord.js";
import updatePresence from "../actions/UpdatePresence";


const cli = require('heroku-cli-util');
const Heroku = require('heroku-client');

// returning owner id at the end
export default function onReady(bot: Client): Promise<string> {
    gb.allMembers = 0;
    debug.info(`Invite link: https://discordapp.com/oauth2/authorize?client_id=372615866652557312&scope=bot&permissions=268463300`);

    let guilds = bot.guilds.array();
    let startupGuild = [];

    for (let guild of guilds) {
        gb.allMembers += guild.members.size;
        startupGuild.push({
            name: guild.name,
            members: guild.members.size,
            channels: guild.channels.size
        });
    }

    startupTable(startupGuild);
    setGlobals(bot);
    updatePresence(bot);
    return bot.fetchApplication().then((app : Discord.OAuth2Application)=> {
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
