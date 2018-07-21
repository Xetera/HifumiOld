import {Channel, Message, TextChannel} from "discord.js";
import {runtimeErrorResponses} from "../../interfaces/Replies";
import {random} from "../../utility/Util";
import {debug} from '../../utility/Logging'
import setConfigChannelEmbed from "../../embeds/commands/configEmbed/setConfigChannelEmbed";
import {Guild} from "../../database/models/guild";
import gb from "../../misc/Globals";
import setConfigChannelFailEmbed from "../../embeds/commands/configEmbed/setConfigChannelFailEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";
import successEmbed from "../../embeds/commands/successEmbed";

async function setLogsChannel(message: Message, channel?: TextChannel){
    try{
        const r: Partial<Guild> = await gb.instance.database.setLogsChannel(
            message.guild.id , channel && channel.id || undefined
        );
        if (!channel){
            return safeSendMessage(message.channel, successEmbed(message.member, `Removed logging channel`));
        }
        const targetChannel = message.client.channels.get(r.logs_channel!);
        if (!targetChannel){
            debug.error(`Could not find channel ${r.logs_channel} in ${message.guild}`, 'SetWarnings');
            return void safeSendMessage(message.channel,
                setConfigChannelFailEmbed(message.channel, 'logs')
            );
        }
        safeSendMessage(message.channel,
            setConfigChannelEmbed(targetChannel, 'logs')
        );

    }
    catch(err) {
        debug.error(`Error while trying to set logs channel\n` + err, 'setWelcomeChannel');
        return safeSendMessage(message.channel, random(runtimeErrorResponses));
    }
}
async function run(message: Message, input: [(TextChannel | boolean | undefined)]): Promise<any> {
    const [channel] = input;
    if (channel instanceof  TextChannel) {
        await gb.instance.database.setLogsChannel(message.guild.id, undefined);
        setLogsChannel(message, channel);
        return;
    } else if (channel === false) {
        await gb.instance.database.removeLogsChannel(message.guild.id);
        setLogsChannel(message, undefined);
        return;
    }
    setLogsChannel(message, <TextChannel> message.channel);
}


export const command: Command = new Command(
    {
        names: ['logchannel'],
        info: "Changes the channel I keep logs in",
        usage: "{{prefix}}logchannel { #channel | 'off' } ",
        examples: ['{{prefix}}logchannel #logs', "{{prefix}}logchannel off"],
        category: 'Settings',
        expects:
            [[{type: ArgType.Channel, options: {channelType: 'text', optional: true}}, {type: ArgType.Boolean}]],
        run: run,
        userPermissions: UserPermissions.Moderator,
    }
);
