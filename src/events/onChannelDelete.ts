import {Channel, TextChannel, VoiceChannel} from "discord.js";
import {LogManager} from "../handlers/logging/logManager";
import {gb} from "../misc/Globals";

export default async function onChannelDelete(channel: Channel){
    if (!(channel instanceof TextChannel) && !(channel instanceof VoiceChannel)){
        return;
    }

    if (!channel.guild.available
        || gb.sleeping
        || !gb.database.ready
        ||!await gb.database.getGuildEnabled(channel.guild.id)){
        return;
    }

    LogManager.logChannelDelete(channel);
}
