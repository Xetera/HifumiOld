import {GuildMember, Message} from "discord.js";
import {strike} from "./strike";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";

async function run(message: Message, input: [GuildMember, string]): Promise<any> {
    const [member, reason] = input;
    if (Number.isInteger(Number(reason.split(' ')[0]))){
        return void handleFailedCommand(
            message.channel, `Warn doesn't require a strike weight.`
        )
    }
    return strike(message, [member, 0, reason]);
}

export const command: Command = new Command(
    {
        names: ['warn'],
        info: 'Sends a warning to a user and adds it to their history.',
        usage: '{{prefix}}warn { user }',
        examples: ['{{prefix}}warn @Xetera'],
        category: 'Moderation',
        expects: [{type: ArgType.Member, options: {strict: true}}, {type: ArgType.Message}],
        run: run,
        userPermissions: UserPermissions.Moderator,
    }
);
