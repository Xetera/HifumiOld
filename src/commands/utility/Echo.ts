import {Message, TextChannel, VoiceChannel} from "discord.js";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";

async function run(message: Message, input: [TextChannel, string]): Promise<any> {
    const [channel, echo] = input;
    if(!message.member.permissionsIn(channel).has('SEND_MESSAGES')){
        return void handleFailedCommand(message.channel,
            `I can only send messages in channels you're allowed to send messages to.`
        );
    }

    if (message.channel instanceof TextChannel){
        let out;
        // we still want admins to be able to make announcements with this
        if (!message.member.hasPermission('ADMINISTRATOR')){
            out = echo.replace('@', '\`@\`');
        }
        else {
            out = echo;
        }
        safeSendMessage(channel, out);
    }
    else if (channel instanceof VoiceChannel){
        handleFailedCommand(message.channel, channel + ' is not a text channel.');
    }
}

export const command: Command = new Command({
        names: ['echo', 'say'],
        info: 'Sends a message to a text channel.',
        usage: '{{prefix}}echo { channel mention } { message }',
        examples: [
            '{{prefix}}echo #general Hey guys!'
        ],
        category: 'Utility',
        expects: [{type: ArgType.Channel, options: {channelType: 'text'}}, {type: ArgType.Message}],
        run: run,
        userPermissions: UserPermissions.Moderator,
    }
);
