import {Channel, Message, TextChannel} from "discord.js";
import {runtimeErrorResponses} from "../../interfaces/Replies";
import {random} from "../../utility/Util";
import {debug} from '../../utility/Logging'
import setConfigChannelEmbed from "../../embeds/commands/configEmbed/setConfigChannelEmbed";
import gb from "../../misc/Globals";
import {Guild} from "../../database/models/guild";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import successEmbed from "../../embeds/commands/successEmbed";

function setWelcomeChannel(message: Message, channel: Channel) {
    gb.instance.database.setWelcomeChannel(message.guild.id, channel.id).then((r: Partial<Guild>) => {
        safeSendMessage(message.channel,
            setConfigChannelEmbed(channel, 'welcome')
        );

    }).catch(err => {
        debug.error(`Error while trying to set welcome channel\n` + err, 'setWelcomeChannel');
        return safeSendMessage(channel, random(runtimeErrorResponses));
    })
}

async function run(message: Message, input: [(TextChannel | boolean | undefined)]): Promise<any> {
    const [channel] = input;
    if (channel instanceof TextChannel) {
        setWelcomeChannel(message, channel);
    }
    else if (channel === false) {
        try {
            await gb.instance.database.removeWelcomeChannel(message.guild.id);
        } catch (err) {
            return handleFailedCommand(message.channel,
                `Something went wrong, I couldn't clear your welcome channel!`
            );
        }
        const embed = successEmbed(message.member, `No longer sending welcome messages`);
        safeSendMessage(message.channel, embed);
    } else {
        setWelcomeChannel(message, message.channel);
    }
}

export const command: Command = new Command(
    {
        names: ['welcomechannel', 'wchannel'],
        info: 'Changes the channel where welcome messages are sent.',
        usage: "{{prefix}}welcomechannel { #channel | 'off' }",
        examples: ['{{prefix}}welcomechannel #general', "{{prefix}}welcomechannel off"],
        category: 'Settings',
        expects:
            [
                [{type: ArgType.Channel, options: {channelType: 'text', optional: true}},
                    {type: ArgType.Boolean,options: {optional: true}}]
            ],
        run: run,
        userPermissions: UserPermissions.Moderator,
    }
);

