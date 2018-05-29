import {Message} from "discord.js";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import inviteEmbed from "../../embeds/commands/inviteEmbed";

export default function invite(message: Message){
    safeSendMessage(message.channel, inviteEmbed());
}
