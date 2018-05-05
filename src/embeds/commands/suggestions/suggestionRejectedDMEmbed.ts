import ReactionManager from "../../../handlers/internal/reactions/reactionManager";
import {RichEmbed} from "discord.js";
import {random} from "../../../utility/Util";
import {Suggestion} from "../../../database/models/suggestion";
import moment = require("moment");

export default function suggestionRejectionEmbed(suggestion: Suggestion){
    const rm = ReactionManager.getInstance();
    return new RichEmbed()
        .setTitle(`Oh no...`)
        .setColor(`#ff4b72`)
        .setThumbnail(random([rm.cringe].concat(rm.shocked).concat(rm.crying)))
        .setDescription(`After being voted on by the members, your suggestion in **${suggestion.guild_name}** was rejected...`)
        .addField(`Original Suggestion Date`, moment(suggestion.suggestion_date).format(`YYYY/MM/DD`))
        .addField(`Your Suggestion`, suggestion.suggestion_message)
        .addField(`Reason for Rejection`, suggestion.status_reason)
        .setTimestamp()
}
