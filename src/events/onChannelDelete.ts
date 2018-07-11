import {Channel, TextChannel, VoiceChannel} from "discord.js";
import {LogManager} from "../handlers/logging/logManager";
import {default as gb} from "../misc/Globals";

export default async function onChannelDelete(channel: Channel){
    if (!(channel instanceof TextChannel) && !(channel instanceof VoiceChannel)){
        return;
    }

    if (!channel.guild.available
        || !gb.instance.database.ready
        ||!await gb.instance.database.getGuildEnabled(channel.guild.id)){
        return;
    }

    LogManager.logChannelDelete(channel);
}
