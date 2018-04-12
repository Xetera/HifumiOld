import {Message} from "discord.js";
import gb from "../../misc/Globals";
import {ICachedMacro, IMacro} from "../../database/TableTypes";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import listMacrosEmbed from "../../embeds/commands/listMacrosEmbed";

export default function listMacros(message: Message){
    const macros: ICachedMacro[] = gb.instance.database.getMacros(message.guild)
        .sort((a: ICachedMacro, b: ICachedMacro) => a.macro_name > b.macro_name ? 1 : -1);
    safeSendMessage(message.channel, listMacrosEmbed(message.guild, macros));

}
