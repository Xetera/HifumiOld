import * as Discord from'discord.js'
import inviteListener from '../listeners/InviteListener'
import * as moment from "moment";
import {MessageType} from "../interfaces/identifiers";
import {gb} from "../misc/Globals";
import pingListener from "../listeners/pingListener";
import memeListener from "../listeners/memeListener";
import hexListener from "../listeners/hexListener";
import {debug} from "../utility/Logging";
import {incrementStat} from "../handlers/logging/datadog";

interface Message extends Discord.Message {
    sent : Date;
}

function middleWare(msg: Discord.Message, ignored: boolean){
    const {messageQueue, hifumi, bot, database} = gb;
    const message = <Message> msg;
    message.sent = moment(new Date()).toDate();
    messageQueue.add(message);
    hifumi.checkMessage(message, bot);
    pingListener(message, database);
    inviteListener(message);
    if (!ignored) {

        memeListener(message);
        hexListener(message);
    }
}

export default async function onMessage(message: Discord.Message){
    // we don't want to look at bot messages at all
    if (message.author.bot
        || gb.sleeping
        || !gb
        || !gb.database
        || !gb.database.ready
        || message.guild && !message.guild.available
        || (message.guild && await gb.database.getChannelIgnored(message.guild.id, message.channel.id))){
        return;
    }

    else if (!gb || !gb.database.ready) {
        return void debug.info(`Got message from ${message.guild.name} but the DB hasn't finished caching.`);
    }


    const messageType: MessageType = message.guild ? MessageType.GuildMessage : MessageType.PrivateMessage;

    // no need listening for anything for pms since it can be flooded and it's literally useless
    let guildEnabled;
    let userIgnored;
    if (messageType === MessageType.GuildMessage){
        guildEnabled = await gb.database.getGuildEnabled(message.guild.id);
        userIgnored = await gb.database.isUserIgnored(message.member);
        if (guildEnabled)
            middleWare(message, userIgnored);
    }

    // we want to serve the help page to the user even if they have the wrong
    // prefix in case they don't know what the prefix is
    else if (messageType === MessageType.PrivateMessage){
        incrementStat(`hifumi.messages_seen`, ['dm']);
        /**
         * TODO: Redirect commands to regular command handler but add an option to exclude commands
         */
        return;
    }

    const prefix = await gb.database.getPrefix(message.guild.id);

    if (!message.content.startsWith(prefix)){
        return;
    }

    // right now this only supports 1 char length prefix but we can change that later
    if (guildEnabled && !userIgnored){
        incrementStat(`hifumi.messages_seen`, ['guild']);
        return gb.commandHandler.handler(message);
    }
}
