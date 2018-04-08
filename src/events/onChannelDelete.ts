import {Channel} from "discord.js";
import {LogManager} from "../handlers/logging/logManager";

export default function onChannelDelete(channel: Channel){
    LogManager.logChannelDelete(channel);
}
