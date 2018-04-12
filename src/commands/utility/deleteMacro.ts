import {Message} from "discord.js";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import gb from "../../misc/Globals";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {IMacro} from "../../database/TableTypes";

export default function deleteMacro(message: Message, args: string[]) {
    if (!args.length){
        return void handleInvalidParameters(
            message.channel, 'deletemacro'
        )
    }
    const macroName = args.shift()!;
    const existingMacro = gb.instance.database.getMacro(message.guild, macroName);
    if (!existingMacro){
        return void handleFailedCommand(
            message.channel, `Macro **${macroName}** was not found.`
        )
    }
    gb.instance.database.deleteMacro(message.guild, macroName).then((r: IMacro) => {
        message.channel.send(`Macro **${r.macro_name}** deleted.`);
    });
}
