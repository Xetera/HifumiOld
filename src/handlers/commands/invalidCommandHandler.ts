import {Channel, TextChannel} from "discord.js";
import {debug} from '../../utility/Logging'
import findCommand from "../../commands/info/help/findCommand";
import invalidParametersEmbed from "../../embeds/commands/invalidParametersEmbed";
import safeSendMessage from "../safe/SafeSendMessage";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

export async function handleInvalidParameters(channel : Channel, commandName: string){
    const database: IDatabase = Container.get(IDatabase);
    const command = findCommand(commandName.toLowerCase());

    if (!(channel instanceof TextChannel)){
        return;
    }
    const prefix = await database.getPrefix(channel.guild.id);
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
