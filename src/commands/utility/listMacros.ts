import {Message} from "discord.js";
import gb from "../../misc/Globals";
import {ICachedMacro, IMacro} from "../../database/TableTypes";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import listMacrosEmbed from "../../embeds/commands/listMacrosEmbed";

export default async function listMacros(message: Message){
    let macros: ICachedMacro[] = await gb.instance.database.getMacros(message.guild.id);
    macros = macros.sort((a: ICachedMacro, b: ICachedMacro) => a.macro_name > b.macro_name ? 1 : -1);
    return safeSendMessage(message.channel, await listMacrosEmbed(message.guild, macros));
}
