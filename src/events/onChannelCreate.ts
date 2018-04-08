import {LogManager} from "../handlers/logging/logManager";
import {Channel} from "discord.js";

export default function onChannelCreate(channel: Channel){
    LogManager.logChannelCreate(channel);
}
