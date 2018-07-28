import {GuildMember, Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {randomRuntimeError} from "../../interfaces/Replies";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import successEmbed from "../../embeds/commands/successEmbed";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

async function run(message: Message, input: [GuildMember]): Promise<any> {
    const [member] = input;
    const database: IDatabase = Container.get(IDatabase);

    let deleted;
    try {
        deleted = await database.deleteAllInfractions(member.guild.id, member.id);
    } catch (e) {
        return handleFailedCommand(message.channel, randomRuntimeError())
    }
    const deleteCount = deleted.raw.length;
    safeSendMessage(message.channel,
        successEmbed(message.member,
            `Deleted ${deleteCount} strikes from ${member.user.username}`));
}

export const command: Command = new Command(
    {
        names: ['cleanstrikes'],
        info: "Cleans all strikes from a user's history.",
        usage: '{{prefix}}cleanstrikes { member }',
        examples: ['{{prefix}}cleanstrikes @Xetera'],
        category: 'Moderation',
        expects: [{type: ArgType.Member}],
        run: run,
        userPermissions: UserPermissions.Moderator,
    }
);
