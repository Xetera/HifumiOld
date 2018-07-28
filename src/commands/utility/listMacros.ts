import {Message} from "discord.js";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import listMacrosEmbed from "../../embeds/commands/listMacrosEmbed";
import {Macro} from "../../database/models/macro";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

async function run(message: Message): Promise<any> {
    const database: IDatabase = Container.get(IDatabase)
    let macros: Macro[] = await database.getMacros(message.guild.id);
    macros = macros.sort((a: Macro, b: Macro) => a.macro_name > b.macro_name ? 1 : -1);
    return safeSendMessage(message.channel, await listMacrosEmbed(message.guild, macros));
}

export const command: Command = new Command(
    {
        names: ['macros'],
        info: 'Lists all the macros saved for this server',
        usage: '{{prefix}}macros',
        examples: ['{{prefix}}macros'],
        category: 'Utility',
        expects: [{type: ArgType.None}],
        run: run,
    }
);
