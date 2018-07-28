import {Message} from "discord.js";
import {User} from "../../database/models/user";
import ignoredEmbed from "../../embeds/moderation/ignoredUsersEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {IgnoredChannel} from "../../database/models/ignoredChannel";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

async function run(message: Message): Promise<any> {
    const database: IDatabase = Container.get(IDatabase)
    Promise.all([
        database.getIgnoredChannels(message.guild.id),
        database.getIgnoredUsers(message.guild.id)
    ]).then((res: [IgnoredChannel[], User[]]) => {
        safeSendMessage(message.channel, ignoredEmbed(res, message.guild));
    });
}

export const command: Command = new Command(
    {
        names: ['ignored', 'ignoring'],
        info: "Gets a list of channels and people I'm ignoring.",
        usage: '{{prefix}}ignored',
        examples: ['{{prefix}}ignored'],
        category: 'Moderation',
        expects: [{type: ArgType.None}],
        run: run,
        userPermissions: UserPermissions.Moderator,
    }
);
