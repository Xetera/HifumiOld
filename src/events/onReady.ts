import {debug, startupTable} from '../utility/Logging'
import {Environments} from "./systemStartup";
import updatePresence from "../actions/UpdatePresence";
import {loadContainers} from "../misc/ioc.config";
import {ITracklist} from "../interfaces/injectables/tracklist.interface";
import {Container} from "typescript-ioc";
import {IClient} from "../interfaces/injectables/client.interface";
import {handleFatalErrorGracefully} from "../handlers/process/fatal";


// returning owner id at the end
export default async function onReady(bot: IClient): Promise<void> {
    const env = process.env['ENVIRONMENT'];
    if (env && (env.toLowerCase() === 'prod' || env.toLowerCase() === 'production')) {
        debug.info(`Running in Production mode.`);
        bot.env = Environments.Production;
    } else {
        debug.info(`Running in Development mode.`);
        bot.env = Environments.Development;
    }
    debug.info(`Invite link: https://discordapp.com/oauth2/authorize?client_id=372615866652557312&scope=bot&permissions=268463300`);

    let startupGuild = [];

    for (let [, guild] of bot.guilds) {
        startupGuild.push({
            name: guild.name,
            members: guild.members.size,
            channels: guild.channels.size
        });
    }
    const trackList: ITracklist = Container.get(ITracklist);

    startupTable(startupGuild);
    setGlobals(bot);
    updatePresence(bot);
    loadContainers();
    trackList.initializeGuilds();
    setInterval(() => {
        updatePresence(bot);
    }, 1000 * 60 * 10);

    const app = await bot.fetchApplication();
    bot.owner = app.owner.id;
    debug.info(`Ready event handler done.`, "Ready");
}

function setGlobals(bot: IClient) {
    const eGuild = process.env['EMOJI_GUILD'];
    if (bot.env === Environments.Production) {
        if (!eGuild) {
            return handleFatalErrorGracefully(
                new Error(
                    "Bot is started in production mode but is missing " +
                    "'EMOJI_GUILD' env variable"
                )
            );
        }
        const guild = bot.guilds.get(eGuild);
        if (!guild) {
            return handleFatalErrorGracefully(
                new Error(
                    `Could not find the emoji server ${eGuild} ` +
                    `in the servers list in production mode.`
                )
            );
        }
        bot.emojiGuild = guild;
        return
    }
    if (!eGuild){
        return;
    }
    bot.emojiGuild = bot.guilds.get(eGuild);
}
