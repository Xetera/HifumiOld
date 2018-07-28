import { Message, TextChannel} from "discord.js";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import setConfigChannelEmbed from "../../embeds/commands/configEmbed/setConfigChannelEmbed";
import {random} from "../../utility/Util";
import {runtimeErrorResponses} from "../../interfaces/Replies";
import {debug} from "../../utility/Logging";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";
import successEmbed from "../../embeds/commands/successEmbed";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

async function setChatChannel(message: Message, channel: TextChannel) {
    const database: IDatabase = Container.get(IDatabase);
    try {
        await database.setChatChannel(message.guild.id, channel.id);
        await message.channel.send(
            setConfigChannelEmbed(channel, 'chat')
        );
        if (message.channel instanceof TextChannel
            && message.channel.topic !== '' && message.guild.me.hasPermission('MANAGE_CHANNELS')) {
            await message.channel.setTopic(`Talk to Hifumi without having to mention her name. @mention or put a - before your messages to talk to other people without having her respond`);
        }
    }
    catch (err) {
        debug.error(`Error while trying to set chat channel\n` + err, 'setWelcomeChannel');
        return safeSendMessage(channel, random(runtimeErrorResponses));
    }
}

async function run(message: Message, input: [(TextChannel | boolean | undefined)]) {
    const [target] = input;
    const database: IDatabase = Container.get(IDatabase);
    if (target instanceof TextChannel) {
        setChatChannel(message, target);
    }
    else if (target === false) {
        try {
            await database.setGuildColumn(message.guild.id, 'chat_channel', undefined);
            return safeSendMessage(message.channel, successEmbed(message.member, `Removed your chat channel.`));
        }
        catch (err) {
            debug.error(`Error while trying to delete chat channel\n` + err, 'setWelcomeChannel');
            return safeSendMessage(message.channel, random(runtimeErrorResponses));
        }
    }
    else {
        setChatChannel(message, <TextChannel> message.channel);
    }
}

export const command: Command = new Command(
    {
        names: ['chatchannel'],
        info: 'Sets the channel that I respond to messages in automatically.',
        usage: "{{prefix}}chatchannel { #channel | 'off' ?}",
        examples:
            [
                '{{prefix}}chatchannel',
                '{{prefix}}chatchannel #chat-with-hifumi'],
        category: 'Settings',
        expects: [
            [{type: ArgType.Channel, options: {channelType: 'text', optional: true}}, {type: ArgType.Boolean}]
        ],
        run: run,
        userPermissions: UserPermissions.Moderator,
    }
);


