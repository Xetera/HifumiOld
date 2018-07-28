import {Collection, Message, Snowflake, TextChannel} from 'discord.js'
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";
import moment = require("moment");
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {randomRuntimeError} from "../../interfaces/Replies";
import {Command} from "../../handlers/commands/Command";
import {debug} from "../../utility/Logging";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";
import {IClient} from "../../interfaces/injectables/client.interface";

async function run(message: Message, input: [(number | undefined)]): Promise<any> {
    const [limit] = input;
    const channel = message.channel;
    const bot: IClient = Container.get(IClient);
    if (channel instanceof TextChannel){
        if (!channel.guild.members.find('id', channel.client.user.id).hasPermission("MANAGE_MESSAGES"))
            return channel.send(`${bot.getEmoji('hifumi_feels_bad_man')} I'm not allowed to delete messages...`);
        const database: IDatabase = Container.get(IDatabase);

        const prefix = await database.getPrefix(channel.guild.id);
        const messages : Collection<Snowflake, Message> = await channel.fetchMessages({limit: limit});

        const botMessages = messages.filter(function(message){
            return (message.author.bot || message.content.startsWith(prefix)) &&
                message.deletable && moment(message.createdAt).add(14, 'd').diff(new Date()) > 0;
        });

        channel.bulkDelete(botMessages)
            .then((res: Collection<string, Message>) => {
                safeSendMessage(channel, `Deleted ${res.size - 1} bot related messages.`, 15);
            })
            .catch(err => {
                safeSendMessage(message.channel, randomRuntimeError());
                debug.error("Error bulk deleting:\n", err);
            });
    }
}

export const command: Command = new Command(
    {
        names: ['cleanse'],
        info: 'Removes messages from bots or those beginning with my prefix from the channel.',
        usage: '{{prefix}}cleanse { messages to check? }',
        examples: ['{{prefix}}cleanse', '{{prefix}}cleanse 30'],
        category: 'Moderation',
        expects: [{type: ArgType.Number, options: {optional: true}}],
        run: run,
        userPermissions: UserPermissions.Moderator,
        clientPermissions: ['MANAGE_MESSAGES']
    }
);
