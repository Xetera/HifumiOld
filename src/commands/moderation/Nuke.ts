import {Collection, Message, Snowflake, TextChannel} from "discord.js";
import {randomRuntimeError} from "../../interfaces/Replies";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import moment = require("moment");
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {debug} from "../../utility/Logging";
import successEmbed from "../../embeds/commands/successEmbed";

async function run(message: Message, input: [number | undefined]): Promise<any> {
    const channel = message.channel;
    let [limit] = input;
    if (limit && limit > 100) {
        return handleFailedCommand(message.channel,
            `Cannot delete more than 100 messages at a time`
        );
    }

    /**
     * we always wanna delete one more unless they want us to delete 100
     * in which case we drop it down to avoid DiscordAPI errors but still
     * delete "a lot"
     */
    if (limit === 100) {
        limit = 99;
    }
    if (channel instanceof TextChannel) {
        // Adding one because we're also deleting the command message
        const messages: Collection<Snowflake, Message> = await channel.fetchMessages({limit: limit && limit + 1 || 50});
        const userMessages = messages.filter((value) => {
            return value.deletable
                && moment(value.createdAt).add(14, 'd').diff(new Date()) > 0;
        });
        let coll: Collection<string, Message>;
        try {
            coll = await channel.bulkDelete(userMessages)
        } catch (err) {
            await channel.send(randomRuntimeError());
            return debug.error("Error bulk deleting:\n", err);
        }
        const embed = successEmbed(message.member, `Deleted the last ${coll.size - 1} messages.`);
        await safeSendMessage(channel, embed, 15)
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
