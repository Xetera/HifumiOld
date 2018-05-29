import {Message, TextChannel} from "discord.js";
import gb from "../../misc/Globals";
import setConfigChannelEmbed from "../../embeds/commands/configEmbed/setConfigChannelEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {debug} from "../../utility/Logging";
import setConfigChannelFailEmbed from "../../embeds/commands/configEmbed/setConfigChannelFailEmbed";

export default function setSuggestionsChannel(message: Message) {
    const channel = message.channel;
    if (!(channel instanceof TextChannel)){
        return;
    }

    gb.instance.database.setSuggestionsChannel(message.guild.id, channel.id).then(() => {
        const embed = setConfigChannelEmbed(channel, 'suggestions');
        safeSendMessage(message.channel, embed);
    }).catch(err => {
        debug.error(err.stack, `setSuggestionsChannel`);
        safeSendMessage(message.channel, setConfigChannelFailEmbed(channel, 'suggestions'));
    })
}
