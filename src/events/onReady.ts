import * as Discord from 'discord.js'
import {debug, GuildStats, startupTable} from '../utility/Logging'
import {gb, emojiName} from "../misc/Globals";
import {createInstance, Environments} from "./systemStartup";
import {Client, Emoji} from "discord.js";
import updatePresence from "../actions/UpdatePresence";
import {incrementStat} from "../handlers/logging/datadog";


// returning owner id at the end
export default async function onReady(bot: Client): Promise<void> {
    gb.allMembers = 0;
    debug.info(`Invite link: https://discordapp.com/oauth2/authorize?client_id=372615866652557312&scope=bot&permissions=268463300`);

    let guilds = bot.guilds.array();
    let startupGuild: GuildStats[] = [];

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
    bot.fetchApplication().then((app: Discord.OAuth2Application) => {
        gb.ownerID = app.owner.id;
    });

    const instances = await createInstance(bot);
    gb.database = instances.database;
    gb.bot = bot;
    gb.database = instances.database;
    gb.hifumi = instances.hifumi;
    gb.messageQueue = instances.messageQueue;
    gb.muteQueue = instances.muteQueue;
    gb.commandHandler = instances.commandHandler;
    gb.trackList = instances.trackList;
    gb.stats = instances.stats;
    gb.trackList.initializeGuilds();
    incrementStat(`hifumi.client.logins`);
    setInterval(() => updatePresence(bot), 1000 * 60 * 10);
}

function setGlobals(bot: Discord.Client) {
    if (gb.ENV === Environments.Production) {
        if (!process.env['EMOJI_GUILD']) {
            debug.error(
                `Missing environment variable 'EMOJI_GUILD' in production mode!`
            );
            return process.exit(1);
        }
    }
    else {
        if (!process.env['EMOJI_GUILD']) {
            return void debug.warn(
                `The env variable 'EMOJI_GUILD was not set, Hifumi will be omitting custom emojis.`
            );
        }
    }
    const guild = bot.guilds.find(g => g.id === process.env['EMOJI_GUILD']);
    if (!guild && gb.ENV === Environments.Development){
        debug.error(`Could not find the emoji guild ${process.env['EMOJI_GUILD']}!`);
        return process.exit(1)
    } else if (!guild && gb.ENV === Environments.Production){
        return void debug.warn(`Emoji guild ${process.env['EMOJI_GUILD']} could not be found, skipping custom emojis`);
    }
    gb.emojiGuild = guild;
    setEmojis();
}

function setEmojis() {
    gb.emojis = new Map<emojiName, Emoji>();
    if (gb.emojiGuild){
        gb.emojiGuild.emojis.forEach(emoji => {
            gb.emojis.set(emoji.name, emoji);
        })
    }
}
