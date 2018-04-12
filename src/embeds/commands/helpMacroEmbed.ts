import {IMacro} from "../../database/TableTypes";
import {Guild, RichEmbed} from "discord.js";
import {commandEmbedColor} from "../../utility/Settings";
import moment = require("moment");

export default function helpMacroEmbed(guild: Guild, macro: IMacro) {
    return new RichEmbed()
        .setTitle(`Macro: __**${macro.macro_name}**__`)
        .setColor(commandEmbedColor)
        .addField(`Created By`, `<@${macro.creator_id}>`, true)
        .addField(`Created At`, moment(macro.date_created).calendar(), true)
        .addField(`Macro Content`, macro.macro_content);
}
