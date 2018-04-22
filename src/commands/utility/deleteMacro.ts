import {Message} from "discord.js";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import gb from "../../misc/Globals";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {debug} from "../../utility/Logging";
import {DeleteResult} from "typeorm";

export default async function deleteMacro(message: Message, args: string[]) {
    if (!args.length){
        return void await handleInvalidParameters(
            message.channel, 'deletemacro'
        )
    }
    const macroName = args.shift()!;
    const existingMacro = gb.instance.database.getMacro(message.guild.id, macroName);
    if (!existingMacro){
        return void handleFailedCommand(
            message.channel, `Macro **${macroName}** was not found.`
        )
    }
    gb.instance.database.deleteMacro(message.guild, macroName).then((r: DeleteResult) => {
        message.channel.send(`Macro **${macroName}** deleted.`);
    }).catch((err: Error)=> {
        debug.error(err, 'deleteMacro');

    })
}
