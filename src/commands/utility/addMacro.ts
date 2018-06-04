import {Message} from "discord.js";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import gb from "../../misc/Globals";
import {Help} from "../info/help/help.interface";
import {debug} from "../../utility/Logging";
import {Macro} from "../../database/models/macro";
const help: Help = require('../../commands/help.json');

export default async function addMacro(message: Message, input: [string, string]) {
    const [macroName, macroContent] = input;
    if (macroContent.length > 2000) {
        return void handleFailedCommand(
            message.channel, `${gb.emojis.get('alexa_boi')} How do you expect me to remember all that? Try something shorter.`
        );
    }
    else if (help.commands.map(command => command.name).includes(macroName)) {
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
        const count = await gb.instance.database.getMacroCount(message.guild.id);

        if (count >= 50 && !await gb.instance.database.getPremium(message.guild.id)) {
            return void handleFailedCommand(
                message.channel, "Whoa, you already have 50 macros saved, time to delete some"
            );
        }

        const found: Macro | undefined = await gb.instance.database.getMacro(message.guild.id, macroName);
        if (found) {
            return void handleFailedCommand(
                message.channel, `A macro with the name **${macroName}** already exists in this server.`
            );
        }

        const macro: Partial<Macro>|undefined = await gb.instance.database.addMacro(message, macroName, macroContent)

        const prefix = await gb.instance.database.getPrefix(message.guild.id);
        if (macro)
            message.channel.send(`From now on I'll respond to **${prefix}${macro.macro_name}** with:\n${macro.macro_content}`);
    }
    catch (err){
        return debug.error(err, 'addMacro')
    }
}
