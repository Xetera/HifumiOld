import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {UserPermissions} from "../../interfaces/command.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {ArgType} from "../../interfaces/arg.interface";

import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

async function run(message: Message, input: [(boolean | undefined)]): Promise<any> {
    const [state] = input;

    const database: IDatabase = Container.get(IDatabase);
    if (state === undefined){
        const state = await database.getGuildColumn(message.guild.id, 'spam_filter');
        return safeSendMessage(message.channel, `**Spam Filter:** ${state ? 'on' : 'off'}`);
    }

    await database.setGuildColumn(message.guild.id,'spam_filter', state);
    return safeSendMessage(message.channel, `My spam filter is now ${state ? 'on' : 'off'}`);
}

export const command: Command = new Command(
    {
        names: ['spamfilter'],
        info: 'Toggles my settings for checking for and deleting spam',
        usage: "{{prefix}}spamfilter { 'on' | 'off'? }",
        examples: ['{{prefix}}spamfilter', '{{prefix}}spamfilter'],
        category: 'Settings',
        expects: [{type: ArgType.Boolean, options: {optional: true}}],
        run: run,
        userPermissions: UserPermissions.Moderator,
        clientPermissions: ['MANAGE_MESSAGES']
    }
);

