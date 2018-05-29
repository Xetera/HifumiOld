import {Database} from "../../database/Database";
import {Channel, Message, TextChannel} from "discord.js";
import {runtimeErrorResponses} from "../../interfaces/Replies";
import {random} from "../../utility/Util";
import {debug} from '../../utility/Logging'
import setConfigChannelEmbed from "../../embeds/commands/configEmbed/setConfigChannelEmbed";
import gb from "../../misc/Globals";
import {Guild} from "../../database/models/guild";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import setConfigChannelFailEmbed from "../../embeds/commands/configEmbed/setConfigChannelFailEmbed";

export default function setWelcome(message : Message){
    const channel = message.channel;
    const guildId = message.guild.id;
    if (channel instanceof TextChannel){
        gb.instance.database.setWelcomeChannel(guildId, channel.id).then((r: Partial<Guild>) => {
            const targetChannel = message.client.channels.get(r.welcome_channel!);
            if (!targetChannel){
                debug.error(`Could not find channel ${r.welcome_channel} in ${message.guild}`, 'SetWarnings');
                return void message.channel.send(
                    setConfigChannelFailEmbed(message.channel, 'warnings')
                );
            }
            message.channel.send(
                setConfigChannelEmbed(targetChannel, 'welcome')
            );

        }).catch(err => {
            debug.error(`Error while trying to set welcome channel\n` + err, 'setWelcomeChannel');
            return safeSendMessage(channel, random(runtimeErrorResponses));
        })
    }
}
