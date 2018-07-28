import {Message} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {debug} from "../../utility/Logging";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

export default async function denySuggestion(message: Message, input: [string]){
    const [id] = input;

    const database: IDatabase = Container.get(IDatabase)
    const response = await database.getSuggestion(message.guild.id, id);
    if (!response){
        await handleFailedCommand(
            message.channel, `I couldn't find any suggestion with the id **${id}**`
        );
        return Promise.reject(`Missing suggestion id`);
    }

    database.denySuggestion(id.toString()).then(() => {
        return safeSendMessage(message.channel, `Suggestion \#${id} was denied.`);
    }).catch(err => {
        debug.error(err.stack, `denySuggestion`);
        return handleFailedCommand(message.channel, `Internal error, I couldn't deny that suggestion.`);
    })
}
