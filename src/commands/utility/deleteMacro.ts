import {Message} from "discord.js";
import gb from "../../misc/Globals";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {debug} from "../../utility/Logging";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {randomRuntimeError} from "../../interfaces/Replies";
import successEmbed from "../../embeds/commands/successEmbed";

async function run(message: Message, input: [string]): Promise<any> {
    const [macroName] = input;
    const existingMacro = await gb.instance.database.getMacro(message.guild.id, macroName);
    if (!existingMacro) {
        return void handleFailedCommand(
            message.channel, `Macro **${macroName}** was not found.`
        )
    }

    try {
        const prefix = await gb.instance.database.getPrefix(message.guild.id);
        await gb.instance.database.deleteMacro(message.guild, macroName);
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
