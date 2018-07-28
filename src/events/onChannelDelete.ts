import {Channel, TextChannel, VoiceChannel} from "discord.js";
import {LogManager} from "../handlers/logging/logManager";
import {Container} from "typescript-ioc";
import {IDatabase} from "../interfaces/injectables/datbase.interface";
import {IClient} from "../interfaces/injectables/client.interface";

export default async function onChannelDelete(channel: Channel){
    const database: IDatabase = Container.get(IDatabase);
    const bot: IClient = Container.get(IClient);

    if (!(channel instanceof TextChannel) && !(channel instanceof VoiceChannel)){
        return;
    }

    if (!channel.guild.available
        || bot.sleeping
        || !database.ready
        ||!await database.getGuildColumn(channel.guild.id, 'enabled')){
        return;
    }

    LogManager.logChannelDelete(channel);
}
