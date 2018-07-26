import {Channel, TextChannel} from "discord.js";
import {debug} from '../../utility/Logging'
import findCommand from "../../commands/info/help/findCommand";
import gb from "../../misc/Globals";
import invalidParametersEmbed from "../../embeds/commands/invalidParametersEmbed";
import safeSendMessage from "../safe/SafeSendMessage";

export async function handleInvalidParameters(channel : Channel, commandName: string){
    const command = findCommand(commandName.toLowerCase());

    if (!(channel instanceof TextChannel)){
        return;
    }
    const prefix = await gb.instance.database.getPrefix(channel.guild.id);
    if (!command){
        debug.error(`Could not find command ${commandName}`, 'handleInvalidParameters');
        return;
    }
    else if (!command.argLength) {
        debug.error(`An uncallable command was referenced`, 'handleInvalidParameters');
        return;
    }

    const embed = await invalidParametersEmbed(prefix, command, channel);
    safeSendMessage(channel, embed);
}
