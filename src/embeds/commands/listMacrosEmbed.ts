import {Guild, RichEmbed} from "discord.js";
import {Macro} from "../../database/models/macro";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";
import {IClient} from "../../interfaces/injectables/client.interface";

export default async function listMacrosEmbed(guild: Guild, macros: Macro[]) {
    const database: IDatabase = Container.get(IDatabase);
    const bot: IClient = Container.get(IClient);

    const premium = await database.getGuildColumn(guild.id, 'premium');
    return new RichEmbed()
        .setColor(`#a8ff6c`)
        .addField(`Macros for ${guild}`, macros.length
            ? macros.map(macro => `\`${macro.macro_name}\``).join(', ')
            : `${bot.getEmoji('hifumi_wew')} this place is so empty. Make a new macro with \`${await database.getPrefix(guild.id)}addmacro\`!`)
        .setFooter(`${macros.length} / ${premium ? 'infinite' : '50'} macros total.`)
}
