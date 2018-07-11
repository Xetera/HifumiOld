import {Message, RichEmbed} from "discord.js";
import {Suggestion, SuggestionStatus} from "../../../database/models/suggestion";

const pendingSuggestionColor = '#fff9ae';
const rejectedSuggestionColor = '#ff2e47';
const acceptedSuggestionColor = '#74ff7f';

export default function suggestionEmbed(message: Message, suggestion: Suggestion){
    let color;
    let status;
    if (suggestion.suggestion_status === 'APPROVED'){
        color = pendingSuggestionColor;
        status = 'Pending'
    } else if (suggestion.suggestion_status === 'ACCEPTED') {
        color = acceptedSuggestionColor;
        status = `Accepted!`;
    } else if (suggestion.suggestion_status === 'REJECTED') {
        color = rejectedSuggestionColor;
        status = `Rejected`;
    }
    else {
        color = pendingSuggestionColor;
        status = 'In consideration'
    }

    const member = message.guild.members.get(suggestion.user_id);
    let user;
    if (!member){
        user = 'Unknown User';
    } else {
        user = member.user.username;
    }

    const embed = new RichEmbed()
        .setTitle(`${user}'s Suggestion`)
        .setDescription(suggestion.suggestion_message)
        .addField(`Status`, status)
        .addField(`Because`, suggestion.status_reason ? suggestion.status_reason : 'In Consideration')
        .setColor(color)
        .setFooter(`ID: ${suggestion.suggestion_id}`)
        .setTimestamp();

    if (member){
        embed.setThumbnail(member.user.avatarURL);
    }
    return embed;
}
