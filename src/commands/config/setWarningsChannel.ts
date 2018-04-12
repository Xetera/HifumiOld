import {Message} from "discord.js";
import {updateWarningsChannel} from "../../database/queries/guildQueries";
import gb from "../../misc/Globals";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {debug} from "../../utility/Logging";
import setConfigChannelFailEmbed from "../../embeds/commands/configEmbed/setConfigChannelFailEmbed";
import setConfigChannelEmbed from "../../embeds/commands/configEmbed/setConfigChannelEmbed";

export default function setWarningsChannel(message: Message) {
    const channel = message.channel;
    gb.instance.database.updateWarningsChannel(message.guild.id, channel.id).then((warnings: string)=> {
        const targetChannel = message.client.channels.get(warnings);
        if (!targetChannel){
            debug.error(`Could not find channel ${warnings} in ${message.guild}`, 'SetWarnings');
            return void message.channel.send(
                setConfigChannelFailEmbed(message.channel, 'warnings')
            );
        }
        message.channel.send(
            setConfigChannelEmbed(targetChannel, 'warnings')
        );
    })
}
