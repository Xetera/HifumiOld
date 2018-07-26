import {GuildMember, Message} from "discord.js";
import {strike} from "./strike";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";

async function run(message: Message, input: [GuildMember, string]): Promise<any> {
    const [member, reason] = input;
    return strike(message, [member, 0, reason]);
}

export const command: Command = new Command(
    {
        names: ['warn'],
        info: 'Sends a warning to a user and adds it to their history.',
        usage: '{{prefix}}warn { user } { reason }',
        examples: ['{{prefix}}warn @Xetera no bully', '{{prefix}}warn pepe no more memes please'],
        category: 'Moderation',
        expects: [{type: ArgType.Member, options: {strict: true}}, {type: ArgType.Message}],
        run: run,
        userPermissions: UserPermissions.Moderator,
    }
);
