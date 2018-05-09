import {Message} from "discord.js";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import pingEmbed from "../../embeds/commands/pingEmbed";

export default function ping(message: Message){
    return safeSendMessage(message.channel, pingEmbed());
}
