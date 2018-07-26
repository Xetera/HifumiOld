import {Message} from "discord.js";
import gb from "../../misc/Globals";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import successEmbed from "../../embeds/commands/successEmbed";
import {randomRuntimeError} from "../../interfaces/Replies";

export async function hints(message: Message, input: [boolean]){
    const [state] = input;
    try {
        await gb.instance.database.setCommandHints(message.guild.id, state);
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
