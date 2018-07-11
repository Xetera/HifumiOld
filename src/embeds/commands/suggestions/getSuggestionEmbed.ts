import {Suggestion} from "../../../database/models/suggestion";
import {Message, RichEmbed} from "discord.js";
import moment = require("moment");
import gb from "../../../misc/Globals";
import {emptySpace} from "../../../utility/Util";

export default function getSuggestionEmbed(message: Message, suggestions: Suggestion[], index: number, prefix: string){
    const suggestion = suggestions[index];
    console.log(suggestion);
    if (!suggestion){
        return new RichEmbed()
            .setTitle(`No suggestions`)
            .setColor(`#ffc2ea`)
            .setDescription(`Pending suggestions will show up here.`)
    }
    //.log(suggestions);
    const member = message.guild.members.find(u => u.id === suggestion.user_id);

    return new RichEmbed()
        .setTitle(`${suggestion.user_name}'s Suggestion`)
        .setThumbnail(member.user.avatarURL)
        .setColor(`#ffc2ea`)
        .setDescription(
            `**Suggestion Count:** ${index + 1}/${suggestions.length}\n` +
            `**ID:** ${suggestion.suggestion_id}\n` +
            `**Date:** ${moment(suggestion.suggestion_date).calendar()}\n`)
        .addField(`Proposal`, suggestion.suggestion_message + emptySpace +
            `\n\nReact with the appropriate emoji below.\n` +
            `**${prefix}help suggestions** for more info`)

        // these are not spaces, don't delete
        .setFooter(`[Prev]   [Next] [Approve]  [Deny]        [Quit]`)
}
