import {Message, TextChannel} from "discord.js";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {UpdateResult} from "typeorm";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {debug} from "../../utility/Logging";
import suggestionEmbed from "../../embeds/commands/suggestions/suggestionEmbed";
import {Suggestion} from "../../database/models/suggestion";

export default async function approveSuggestion(message: Message, input: [string]){
    const [id] = input;
    const suggestionsChannel = await gb.instance.database.getSuggestionsChannel(message.guild.id);

    if (!suggestionsChannel){
        await handleFailedCommand(
            message.channel, `Oh, I don't have your suggestions channel saved.\nSuggestion was **not** approved.`
        );
        return Promise.reject(`Channel not saved`);
    }

    const channel = <TextChannel> message.guild.channels.get(suggestionsChannel);
    if (!channel){
        await handleFailedCommand(
            message.channel, `The channel I had saved for your suggestion no longer exists.`
        );
        return Promise.reject(`Channel missing`);
    }

    const response = await gb.instance.database.getSuggestion(message.guild.id, id)
    if (!response){
        await handleFailedCommand(
            message.channel, `I couldn't find any suggestion with the id **${id}**`
        );
        return Promise.reject(`Missing suggestion id`);
    }

    gb.instance.database.approveSuggestion(id.toString()).then((r: UpdateResult) => {
        const embed = suggestionEmbed(message, r.raw[0]);
        return Promise.all([safeSendMessage(channel, embed), r.raw[0].suggestion_id]);
    }).then(async(response: [Message|Message[]|void, string]) => {
        const [r, suggestion_id] = response;
        if (r){
            await (<Message> r).react(`👍`);
            await (<Message> r).react(`👎`);
            await gb.instance.database.setSuggestionMetadata(
                suggestion_id,
                (<Message> r).channel.id,
                (<Message> r).id
            );
            return safeSendMessage(message.channel, `Suggestion \#${id} was approved and added to the suggestion board.`)
        }
        else {
            return await handleFailedCommand(
                message.channel, `Oh no I couldn't post to the suggestions channel`
            );
        }
    }).catch(err => {
        debug.error(err.stack, `approveSuggestion`);
        return handleFailedCommand(message.channel, `Internal error, I couldn't approve that suggestion.`);
    })
}
