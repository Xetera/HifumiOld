import {Message, TextChannel} from "discord.js";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import gb from "../../misc/Globals";
import setConfigChannelEmbed from "../../embeds/commands/configEmbed/setConfigChannelEmbed";
import {Guild} from "../../database/models/guild";
import {random} from "../../utility/Util";
import {runtimeErrorResponses} from "../../interfaces/Replies";
import {debug} from "../../utility/Logging";
import setConfigChannelFailEmbed from "../../embeds/commands/configEmbed/setConfigChannelFailEmbed";

export default function setChatChannel(message: Message){
    const channel = message.channel;
    const guildId = message.guild.id;
    if (channel instanceof TextChannel){
        gb.instance.database.setChatChannel(guildId, channel.id).then((r: Partial<Guild>) => {
            const targetChannel = message.client.channels.get(r.chat_channel!);
            if (!targetChannel){
                debug.error(`Could not find channel ${r.chat_channel} in ${message.guild}`, 'SetWarnings');
                return void message.channel.send(
                    setConfigChannelFailEmbed(message.channel, 'chat')
                );
            }
            message.channel.send(
                setConfigChannelEmbed(targetChannel, 'chat')
            );
            if (message.channel instanceof TextChannel && message.channel.topic !== ''){
                message.channel.setTopic(`Talk to Hifumi without having to mention her name. @mention or put a - before your messages to talk to other people without having her respond`);
            }
        }).catch(err => {
            debug.error(`Error while trying to set chat channel\n` + err, 'setWelcomeChannel');
            return safeSendMessage(channel, random(runtimeErrorResponses));
        })
    }

}
