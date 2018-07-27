import {Client, Message} from "discord.js";
import {codeBlock} from "../../utility/Markdown";
import gb from "../../misc/Globals";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";
import {Container} from "typescript-ioc";

async function run(message: Message): Promise<any> {
    const guilds = await gb.instance.database.getGuilds();
    const rows = guilds.map(g => {
        const bot: Client = Container.get(Client);
        const guild = bot.guilds.get(g.id);
        if (!guild) {
            return `GUILD [${g.id}] MISSING`
        }
        return `${guild.name} => ${guild.memberCount} members | ${g.cleverbot_calls} API calls`;
    });
    return message.channel.send(codeBlock(rows.join('\n')), {split: true});
}

export const command: Command = new Command(
    {
        names: ['*listguilds'],
        info: 'OWNER COMMAND',
        usage: 'OWNER COMMAND',
        examples: ['OWNER COMMAND'],
        category: 'Debug',
        expects: [{type: ArgType.None}],
        run: run,
        hidden: true,
        ownerOnly: true,
        userPermissions: UserPermissions.BotOwner,
    }
);
