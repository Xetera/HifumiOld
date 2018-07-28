import {Message} from "discord.js";
import {gb} from "../../misc/Globals";
import {User} from "../../database/models/user";
import ignoredEmbed from "../../embeds/moderation/ignoredUsersEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {IgnoredChannel} from "../../database/models/ignoredChannel";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";

async function run(message: Message): Promise<any> {
    Promise.all([
        gb.database.getIgnoredChannels(message.guild.id),
        gb.database.getIgnoredUsers(message.guild.id)
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
