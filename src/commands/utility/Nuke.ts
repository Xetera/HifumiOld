import {Collection, Message, Snowflake, TextChannel} from "discord.js";
import {randomRuntimeError} from "../../interfaces/Replies";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import moment = require("moment");
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";

async function run(message: Message, input: [number | undefined ]): Promise<any> {
    const channel = message.channel;
    const limit = Array.isArray(input) ? input.shift()! : 49;
    if (channel instanceof TextChannel){
        // Adding one because we're also deleting the command message
        const messages : Collection<Snowflake, Message> = await channel.fetchMessages({limit: limit + 1});
        const userMessages = messages.filter((value) => {
            return value.deletable
                && moment(value.createdAt).add(14, 'd').diff(new Date()) > 0;
        });
        await channel.bulkDelete(userMessages)
            .then(async(coll: Collection<string, Message>) => {
                safeSendMessage(channel, `Deleted the last ${coll.size - 1} messages.`, 15)
            }).catch(err => {
                channel.send(randomRuntimeError());
                console.log("Error bulk deleting:\n", err);
            });
    }
}

export const command: Command = new Command(
    {
        names: ['nuke'],
        info: 'Nukes a set amount of messages from the current channel. Default 10',
        usage: '{{prefix}}nuke { amount of messages? }',
        examples: [
            '{{prefix}}nuke',
            '{{prefix}}nuke 100'
        ],
        category: 'Utility',
        expects: [{type: ArgType.Number, options: {optional: true, maxRange: 100}}],
        run: run,
        userPermissions: UserPermissions.Moderator,
        clientPermissions: ['MANAGE_MESSAGES']
    }
);
