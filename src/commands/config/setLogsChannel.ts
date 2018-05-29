import {Database} from "../../database/Database";
import {Channel, Message, TextChannel} from "discord.js";
import {runtimeErrorResponses} from "../../interfaces/Replies";
import {random} from "../../utility/Util";
import {debug} from '../../utility/Logging'
import hasMessagingPermissions from "../../handlers/permissions/missingPermissionsHandler";
import setConfigChannelEmbed from "../../embeds/commands/configEmbed/setConfigChannelEmbed";
import {Guild} from "../../database/models/guild";
import gb from "../../misc/Globals";
import setConfigChannelFailEmbed from "../../embeds/commands/configEmbed/setConfigChannelFailEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

export default function setLogsChannel(message: Message){
    const channel = message.channel;
    const guildId = message.guild.id;

    if (!(channel instanceof TextChannel)) {
        return;
    }

    gb.instance.database.setLogsChannel(guildId, channel.id).then((r: Partial<Guild>) => {
        const targetChannel = message.client.channels.get(r.logs_channel!);
        if (!targetChannel){
            debug.error(`Could not find channel ${r.logs_channel} in ${message.guild}`, 'SetWarnings');
            return void message.channel.send(
                setConfigChannelFailEmbed(message.channel, 'logs')
            );
        }
        message.channel.send(
            setConfigChannelEmbed(targetChannel, 'logs')
        );
    }).catch(err => {
        debug.error(`Error while trying to set logs channel\n` + err, 'setWelcomeChannel');
        return safeSendMessage(channel, random(runtimeErrorResponses));
    })

}
