import {LogManager} from "../handlers/logging/logManager";
import {Channel, TextChannel, VoiceChannel} from "discord.js";
import {IClient} from "../interfaces/injectables/client.interface";
import {Container} from "typescript-ioc";
import {IDatabase} from "../interfaces/injectables/datbase.interface";

export default async function onChannelCreate(channel: Channel){
    const database: IDatabase = Container.get(IDatabase);

    if (!(channel instanceof TextChannel) && !(channel instanceof VoiceChannel)){
        return;
    }

    const bot = Container.get(IClient);
    if (!channel.guild.available
        || bot.sleeping
        || !database.ready
        ||!await database.getGuildColumn(channel.guild.id, 'enabled')){
        return;
    }

    LogManager.logChannelCreate(channel);
}
