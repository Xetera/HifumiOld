import {getDatabaseConnection, getEnvironmentSettings, getTokens} from "./src/events/systemStartup";
import gb, {Instance} from './src/misc/Globals';

gb.ENV  = getEnvironmentSettings();

// lol @ me passing in "global" variables
const [BOT_TOKEN, CLEVERBOT_TOKEN] : string[] = getTokens(gb.ENV);
const DATABASE_URL : DatabaseConfig = getDatabaseConnection(gb.ENV);

// modules
import {Database, DatabaseConfig} from "./src/database/Database";
import {Alexa} from "./src/API/Alexa";
import {MuteQueue} from './src/moderation/MuteQueue'
import {MessageQueue} from "./src/moderation/MessageQueue";
import onReady from './src/events/onReady'
import onMessage from './src/events/onMessage'
import onGuildMemberAdd from "./src/events/onGuildMemberAdd";
import onGuildMemberRemove from "./src/events/onGuildMemberRemove";
import onGuildCreate from "./src/events/onGuildCreate";

import * as Discord from 'discord.js'
import onChannelCreate from "./src/events/onChannelCreate";
import updatePresence from "./src/actions/UpdatePresence";
import CommandHandler from "./src/handlers/CommandHandler";
import Watchlist from "./src/moderation/Watchlist";
import onMessageUpdate from "./src/events/onMessageUpdate";

// instances
function createInstance(): Instance {
    // this is how we avoid scoping problems, a little ugly but
    // it gets the job done
    let bot =new Discord.Client();
    let alexa = new Alexa(CLEVERBOT_TOKEN);
    let database = new Database(DATABASE_URL, bot);
    let muteQueue = new MuteQueue(database);
    let watchlist = new Watchlist();
    let messageQueue = new MessageQueue(muteQueue, database, watchlist);
    let commandHandler = new CommandHandler();
    return {
        bot: bot,
        alexa: alexa,
        muteQueue: muteQueue,
        database: database,
        messageQueue: messageQueue,
        commandHandler:commandHandler,
        watchlist: watchlist
    }
}

const instance = createInstance();
gb.instance = instance;
instance.bot.login(BOT_TOKEN);


setInterval(function(){
    updatePresence(instance.bot);
}, 1000 * 60 * 10);

instance.bot.on('ready', async function(){
    gb.ownerID = await onReady(instance);
});

instance.bot.on('message', function(message : Discord.Message){
    onMessage(message, instance);
});

instance.bot.on('messageUpdate', function(oldMessage: Discord.Message, newMessage: Discord.Message){
    onMessageUpdate(oldMessage, newMessage);
});
instance.bot.on('guildMemberAdd', function(member : Discord.GuildMember){
    onGuildMemberAdd(member, instance);
});

instance.bot.on('guildMemberRemove', function(member : Discord.GuildMember){
    onGuildMemberRemove(member);
});

instance.bot.on('guildCreate', function(guild : Discord.Guild){
    onGuildCreate(guild, instance);
});

instance.bot.on('channelCreate', function(channel :Discord.Channel){
    onChannelCreate(channel);
});