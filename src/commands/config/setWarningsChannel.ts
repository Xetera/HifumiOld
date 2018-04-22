import {Message} from "discord.js";
import gb from "../../misc/Globals";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {debug} from "../../utility/Logging";
import setConfigChannelFailEmbed from "../../embeds/commands/configEmbed/setConfigChannelFailEmbed";
import setConfigChannelEmbed from "../../embeds/commands/configEmbed/setConfigChannelEmbed";
import {Guild} from "../../database/models/guild";
import {random} from "../../utility/Util";
import {runtimeErrorResponses} from "../../interfaces/Replies";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

export default function setWarningsChannel(message: Message) {
    const channel = message.channel;
    gb.instance.database.setWarningsChannel(message.guild.id, channel.id).then((r: Partial<Guild>)=> {
        const targetChannel = message.client.channels.get(r.warnings_channel!);
        if (!targetChannel){
            debug.error(`Could not find channel ${r.warnings_channel} in ${message.guild}`, 'SetWarnings');
            return void message.channel.send(
                setConfigChannelFailEmbed(message.channel, 'warnings')
            );
        }
        message.channel.send(
            setConfigChannelEmbed(targetChannel, 'warnings')
        );
    }).catch(err => {
        debug.error(err, `setWarningsChannel`);
        return safeSendMessage(channel, random(runtimeErrorResponses));
    })
}
