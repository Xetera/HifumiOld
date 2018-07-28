import * as Discord from'discord.js'
import inviteListener from '../listeners/InviteListener'
import * as moment from "moment";
import {MessageType} from "../interfaces/identifiers";
import DMCommandHandler from "../handlers/commands/DMCommandHandler";
import pingListener from "../listeners/pingListener";
import memeListener from "../listeners/memeListener";
import hexListener from "../listeners/hexListener";
import {ICleverbot} from "../interfaces/injectables/cleverbot.interface";
import {Container} from "typescript-ioc";
import {ICommandHandler} from "../interfaces/injectables/commandHandler.interface";
import {IMessageQueue} from "../interfaces/injectables/messageQueue.interface";
import {IDatabase} from "../interfaces/injectables/datbase.interface";
import {IClient} from "../interfaces/injectables/client.interface";
import {debug} from "../utility/Logging";

interface Message extends Discord.Message {
    sent : Date;
}

function middleWare(msg: Discord.Message, ignored: boolean){
    const messageQueue: IMessageQueue = Container.get(IMessageQueue);

    const message = <Message> msg;
    message.sent = moment(new Date()).toDate();
    messageQueue.add(message);
    const hifumi: ICleverbot = Container.get(ICleverbot);

    hifumi.checkMessage(message);
    pingListener(message);
    inviteListener(message);
    if (!ignored) {

        memeListener(message);
        hexListener(message);
    }
}

export default async function onMessage(message: Discord.Message){
    const database: IDatabase = Container.get(IDatabase);
    const bot: IClient = Container.get(IClient);
    // we don't want to look at bot messages at all
    if (message.author.bot
        || bot.sleeping
        || !database.ready
        || message.guild && !message.guild.available
        || (message.guild && await database.getChannelIgnored(message.guild.id, message.channel.id))){
        return;
    }
    else if (!database.ready) {
        return void debug.info(`Got message from ${message.guild.name} but the DB hasn't finished caching.`);
    }


    const messageType: MessageType = message.guild ? MessageType.GuildMessage : MessageType.PrivateMessage;

    // no need listening for anything for pms since it can be flooded and it's literally useless
    let guildEnabled;
    let userIgnored;
    if (messageType === MessageType.GuildMessage){
        guildEnabled = await database.getGuildColumn(message.guild.id, 'enabled');
        userIgnored = await database.isUserIgnored(message.member);
        if (guildEnabled)
            middleWare(message, userIgnored);
    }

    // we want to serve the help page to the user even if they have the wrong
    // prefix in case they don't know what the prefix is
    else if (messageType === MessageType.PrivateMessage)
        return DMCommandHandler(message);

    const prefix = await database.getPrefix(message.guild.id);

    if (!message.content.startsWith(prefix))
        return;

    // right now this only supports 1 char length prefix but we can change that later
    if (guildEnabled && !userIgnored){
        const commandHandler: ICommandHandler = Container.get(ICommandHandler);
        return commandHandler.handler(message);
    }
}
