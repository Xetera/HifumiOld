import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import gb from "../../misc/Globals";
import {Guild} from "../../database/models/guild";
import {debug} from "../../utility/Logging";
import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

export default async function setPrefix(message: Message, input: [string]){
    const [prefix] = input;
    if (prefix.length > 1)
        return handleFailedCommand(message.channel, `Only single character prefixes are supported right now.`);

    try {
        const res: Partial<Guild> = await gb.instance.database.setPrefix(message.guild.id, prefix);
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
