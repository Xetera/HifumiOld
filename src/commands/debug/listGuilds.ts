import {Message} from "discord.js";
import {codeBlock} from "../../utility/Markdown";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";

async function run(message: Message): Promise<any> {
    const guilds = await gb.instance.database.getGuilds();
    const rows = guilds.map(g => {
        const guild = gb.instance.bot.guilds.get(g.id);
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
