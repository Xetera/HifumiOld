import {Suggestion} from "../../../database/models/suggestion";
import {RichEmbed} from "discord.js";
import moment = require("moment");
import ReactionManager from "../../../handlers/internal/reactions/reactionManager";
import {random} from "../../../utility/Util";

export default function suggestionAcceptedDMEmbed(suggestion: Suggestion){
    return new RichEmbed()
        .setTitle(`Yay!`)
        .setColor(`#7effa0`)
        .setThumbnail(random(ReactionManager.getInstance().smile))
        .setDescription(`After being voted on by the members, your suggestion in **${suggestion.guild_name}** was accepted!`)
        .addField(`Original Suggestion Date`, moment(suggestion.suggestion_date).format(`YYYY/MM/DD`))
        .addField(`Your Suggestion`, suggestion.suggestion_message)
        .addField(`Reason for Acceptance`, suggestion.status_reason)
        .setTimestamp()
}
