import {ICachedMacro, IMacro} from "../../database/TableTypes";
import {Guild, RichEmbed} from "discord.js";
import gb from "../../misc/Globals";

export default async function listMacrosEmbed(guild: Guild, macros: ICachedMacro[]) {
    return new RichEmbed()
        .setColor(`#a8ff6c`)
        .addField(`Macros for ${guild}`, macros.length
            ? macros.map(macro => `\`${macro.macro_name}\``).join(', ')
            : `${gb.emojis.get('alexa_wew')} this place is so empty. Make a new macro with \`${await gb.instance.database.getPrefix(guild.id)}addmacro\`!`)
        .setFooter(`${macros.length} / 50 macros total.`)
}
