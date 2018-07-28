import {Message} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {debug} from "../../utility/Logging";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {randomRuntimeError} from "../../interfaces/Replies";
import successEmbed from "../../embeds/commands/successEmbed";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

async function run(message: Message, input: [string]): Promise<any> {
    const [macroName] = input;
    const database: IDatabase = Container.get(IDatabase);
    const existingMacro = await database.getMacro(message.guild.id, macroName);
    if (!existingMacro) {
        return void handleFailedCommand(
            message.channel, `Macro **${macroName}** was not found.`
        )
    }

    try {
        const prefix = await database.getPrefix(message.guild.id);
        await database.deleteMacro(message.guild, macroName);
        safeSendMessage(message.channel, successEmbed(message.member, `Macro **${prefix}${macroName}** removed.`));
    }
    catch (err){
        debug.error(err, 'deleteMacro');
        safeSendMessage(message.channel, randomRuntimeError());
    }
}

export const command: Command = new Command(
    {
        names: ['deletemacro', 'delm', 'delmacro'],
        info: 'Deletes a saved macro.',
        usage: '{{prefix}}deletemacro',
        examples: ['{{prefix}}deletemacro rolepls'],
        category: 'Utility',
        expects: [{type: ArgType.String}],
        run: run,
        userPermissions: UserPermissions.Moderator,
    }
);
