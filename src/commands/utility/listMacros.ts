import {Message} from "discord.js";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import listMacrosEmbed from "../../embeds/commands/listMacrosEmbed";
import {Macro} from "../../database/models/macro";

export default async function listMacros(message: Message){
    let macros: Macro[] = await gb.instance.database.getMacros(message.guild.id);
    macros = macros.sort((a: Macro, b: Macro) => a.macro_name > b.macro_name ? 1 : -1);
    return safeSendMessage(message.channel, await listMacrosEmbed(message.guild, macros));
}
