import {ICachedMacro, IMacro} from "../../database/TableTypes";
import {Guild, RichEmbed} from "discord.js";
import gb from "../../misc/Globals";

export default function listMacrosEmbed(guild: Guild, macros: ICachedMacro[]) {
    return new RichEmbed()
        .setColor(`#a8ff6c`)
        .addField(`Macros for ${guild}`, macros.length
            ? macros.map(macro => `\`${macro.macro_name}\``).join(', ')
            : `Nothing here, make a new macro with \`${gb.instance.database.getPrefix(guild.id)}addmacro\`!`);
}
