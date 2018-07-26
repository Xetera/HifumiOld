import {Message} from "discord.js";
import gb from "../../misc/Globals";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {debug} from "../../utility/Logging";

export default async function denySuggestion(message: Message, input: [string]){
    const [id] = input;

    const response = await gb.instance.database.getSuggestion(message.guild.id, id)
    if (!response){
        await handleFailedCommand(
            message.channel, `I couldn't find any suggestion with the id **${id}**`
        );
        return Promise.reject(`Missing suggestion id`);
    }

    gb.instance.database.denySuggestion(id.toString()).then(() => {
        return safeSendMessage(message.channel, `Suggestion \#${id} was denied.`);
    }).catch(err => {
        debug.error(err.stack, `denySuggestion`);
        return handleFailedCommand(message.channel, `Internal error, I couldn't deny that suggestion.`);
    })
}
