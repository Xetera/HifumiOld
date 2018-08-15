import {Message} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {gb} from "../../misc/Globals";
import {debug} from "../../utility/Logging";
import {Macro} from "../../database/models/macro";
import { parseMacro} from "../../parsers/parseMacro";
import {urlRegex} from "../../listeners/Regex";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import successEmbed from "../../embeds/commands/successEmbed";

async function run(message: Message, input: [string, string]): Promise<any> {
    const [macroName, macroContent] = input;
    // Urls shouldn't be counting as messages
    if (macroContent.replace(urlRegex, '').length > 2000) {
        return void handleFailedCommand(
            message.channel, `${gb.emojis.get('hifumi_boi')} How do you expect me to remember all that? Try something shorter.`
        );
    }
    else if (gb.commandHandler.commands.some(command => command.names.includes(macroName))) {
        return void handleFailedCommand(
            message.channel, "That macro is already a command name, try to pick something else."
        );
    }
    else if (message.mentions.users.size){
        return void handleFailedCommand(
            message.channel,
            `Mentions are not allowed in macros, do you know how annoying it is to get pinged by bots? (⁎˃ᆺ˂)`
        )
    }

    try {
        const count = await gb.database.getMacroCount(message.guild.id);

        if (count >= 50 && !await gb.database.getPremium(message.guild.id)) {
            return void handleFailedCommand(
                message.channel, "Whoa, you already have 50 macros saved, time to delete some"
            );
        }

        const found: Macro | undefined = await gb.database.getMacro(message.guild.id, macroName);
        if (found) {
            return void handleFailedCommand(
                message.channel, `A macro with the name **${macroName}** already exists in this server.`
            );
        }

        const [content, links] = await parseMacro(macroContent);
        if (!content && !links){
            return;
        }
        const prefix = await gb.database.getPrefix(message.guild.id);

        const macro: Partial<Macro>|undefined = await gb.database.addMacro(message, macroName, content, links);
        if (macro){
            return safeSendMessage(message.channel, successEmbed(message.member, `Macro **${prefix}${macroName}** saved.`));
        }
        safeSendMessage(message.channel, `Uh, I couldn't save that macro for some reason...`);
    }
    catch (err){
        debug.error(err);
        return safeSendMessage(message.channel, `Something went wrong while trying to save that macro.`);
    }
}

export const command: Command = new Command(
    {
        names: ['addmacro', 'am'],
        info: 'Creates a new macro. Macros are custom commands that you can save specific replies to.',
        usage: '{{prefix}}addmacro { macro name } { response }',
        examples: ["{{prefix}}addmacro rolepls Don't beg for a role, mods give them based on activity."],
        category: 'Utility',
        expects: [{type: ArgType.String}, {type: ArgType.Message}],
        run: run,
        userPermissions: UserPermissions.Moderator,
    }
);
