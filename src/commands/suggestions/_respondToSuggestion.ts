import {Message, TextChannel} from "discord.js";
import gb from "../../misc/Globals";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import suggestionEmbed from "../../embeds/commands/suggestions/suggestionEmbed";
import resolveBooleanUncertainty from "../../resolvers/resolveBooleanUncertainty";
import areYouSureEmbed from "../../embeds/commands/areYouSureEmbed";
import suggestionAcceptedDMEmbed from "../../embeds/commands/suggestions/suggestionAcceptedDMEmbed";
import suggestionRejectionEmbed from "../../embeds/commands/suggestions/suggestionRejectedDMEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

export enum SuggestionResponse {
    PENDING,
    ACCEPTED,
    REJECTED,
    AWAITING_APPROVAL
}

export async function _respondToSuggestion(message: Message, input: [number, string], response: SuggestionResponse): Promise<any> {
    const [id, reason] = input;

    const suggestion = await gb.instance.database.getSuggestion(message.guild.id, id.toString());
    if (!suggestion){
        return await handleFailedCommand(
            message.channel, `I can't respond to that suggestion because it doesn't exist.`
        );
    }
    const channel = <TextChannel> message.guild.channels.get(suggestion.channel_id);

    if (!channel){
        return await handleFailedCommand(
            message.channel, `I can't find the channel that I sent that suggestion in.`
        );
    }

    const oldMessage = await channel.fetchMessage(suggestion.message_id);
    if (!oldMessage){
        return await handleFailedCommand(
            message.channel, `I couldn't find the message I posted in the suggestion channel.\nIt's probably deleted or **REALLY** old.`
        )
    }

    if (suggestion.suggestion_status !== 'APPROVED'
        && !await resolveBooleanUncertainty(message,
            await areYouSureEmbed(`This suggestion was already resolved, are you sure you want to respond to it again?`, 30, message.guild), 30000)){
        return;
    }

    const user = message.guild.members.get(suggestion.user_id);

    if (response === SuggestionResponse.ACCEPTED){
        let response = `Accepted suggestion #${suggestion.suggestion_id}`;
        const updateResult = await gb.instance.database.acceptSuggestion(id.toString(), reason);
        const acceptedSuggestion = updateResult.raw[0];
        const acceptionEmbed = suggestionEmbed(message, acceptedSuggestion);
        if (user){
            user.send(suggestionAcceptedDMEmbed(acceptedSuggestion));
            safeSendMessage(message.channel, response);
        }
        else {
            safeSendMessage(message.channel, response + `\nBut I did not inform the original sender, they might have left.`);
        }

        oldMessage.delete();
        safeSendMessage(channel, acceptionEmbed);
    }
    else if (response === SuggestionResponse.REJECTED){
        let response = `Rejected suggestion #${suggestion.suggestion_id}`;
        const updateResult = await gb.instance.database.rejectSuggestion(id.toString(), reason);
        const rejectedSuggestion = updateResult.raw[0];
        const rejectionEmbed = suggestionEmbed(message, rejectedSuggestion);
        if (user){
            user.send(suggestionRejectionEmbed(rejectedSuggestion));
            safeSendMessage(message.channel, response);
        }
        else {
            safeSendMessage(message.channel, response + `\nBut I could not inform the original sender, they might have left.`);
        }
        oldMessage.delete();
        safeSendMessage(channel, rejectionEmbed);
    }
}


