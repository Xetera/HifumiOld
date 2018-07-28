import {Message} from "discord.js";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import successEmbed from "../../embeds/commands/successEmbed";
import {randomRuntimeError} from "../../interfaces/Replies";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

export async function hints(message: Message, input: [boolean]){
    const database: IDatabase = Container.get(IDatabase)
    const [state] = input;
    try {
        await database.setGuildColumn(message.guild.id,'hints', state);
    }
    catch (err) {
        return safeSendMessage(message.channel, randomRuntimeError());
    }

    safeSendMessage(
        message.channel,
        successEmbed(message.member, `My command hints are **${state ? 'on' : 'off'}** now.`)
    );
}

export const command: Command = new Command(
    {
        names: ['hints'],
        info: 'Toggles my settings for suggesting corrections to incorrect commands.',
        usage: "{{prefix}}hints { 'on' | 'off' }",
        examples: ['{{prefix}}hints off'],
        category: 'Settings',
        expects: [{type: ArgType.Boolean}],
        run: hints,
        userPermissions: UserPermissions.Moderator,
    }
);
