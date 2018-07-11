import {Guild, RichEmbed} from "discord.js";
import {commandEmbedColor} from "../../../utility/Settings";
import moment = require("moment");
import {Macro} from "../../../database/models/macro";
import {formatAndJoin, StringUtils} from "../../../utility/Util";

export default function helpMacroEmbed(guild: Guild, macro: Macro) {
    const member = guild.members.get(macro.creator_id);
    const embed = new RichEmbed()
        .setColor(commandEmbedColor)
        .addField(`Created By`, member || `Unknown Member`, true)
        .addField(`Created At`, moment(macro.date_created).calendar(), true);

    embed.setAuthor(`Macro: ${macro.macro_name}`, member && member.user.avatarURL);

    if (macro.macro_content){
        embed.addField(`Content`, StringUtils.shortenString(macro.macro_content));
    }
    if (macro.macro_links && macro.macro_links.length){
        embed.addField(`Attachments`, formatAndJoin(macro.macro_links, '', '\n'))
    }
    return embed;
}
