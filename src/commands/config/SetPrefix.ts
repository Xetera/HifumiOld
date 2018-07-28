import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {Guild} from "../../database/models/guild";
import {debug} from "../../utility/Logging";
import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {UserPermissions} from "../../interfaces/command.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {ArgType} from "../../interfaces/arg.interface";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

export default async function setPrefix(message: Message, input: [string]){
    const [prefix] = input;
    if (prefix.length > 1)
        return handleFailedCommand(message.channel, `Only single character prefixes are supported right now.`);

    const database: IDatabase = Container.get(IDatabase);
    try {
        const res: Partial<Guild> = await database.setGuildColumn(message.guild.id, 'prefix', prefix);
        safeSendMessage(message.channel, 'Prefix changed to ' + res.prefix);
    }
    catch(err) {
        debug.error(err, `setPrefix`);
    }
}

export const command: Command = new Command(
    {
        names: ['setprefix', 'prefix'],
        info: 'Changes the prefix I listen for',
        usage: '{{prefix}}setprefix { character }',
        examples: ['{{prefix}}setprefix !'],
        category: 'Settings',
        expects: [{type: ArgType.String}],
        run: setPrefix,
        userPermissions: UserPermissions.Administrator
    }
);
