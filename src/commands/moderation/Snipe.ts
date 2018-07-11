import * as Discord from 'discord.js'
import {Collection, GuildMember, Message} from "discord.js";
import {randomRuntimeError} from "../../interfaces/Replies";
import {debug} from '../../utility/Logging'
import {safeGetArgs} from "../../utility/Util";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import moment = require("moment");
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";

async function run(message: Message, input: [GuildMember, (number | undefined)]): Promise<any> {
    const [target, limit] = input;
    const channel = message.channel;
    if (channel instanceof Discord.TextChannel){
        channel.fetchMessages({limit: limit}).then((messages: Collection<Discord.Snowflake, Message>) => {
            const userMessages = messages.filter((value) => {
                return value.author.id === target.id && value.deletable
                    && moment(value.createdAt).add(14, 'd').diff(new Date()) > 0;
            });
            return channel.bulkDelete(userMessages);
        }).then(async(r: Collection<string, Message>) => {
            debug.info(
                `Deleted ${r.size} messages from ${target.user.username} ` +
                `in [${target.guild.name}:${channel.name}].`
            );
            safeSendMessage( message.channel, `Deleted ${r.size} messages from ${target.user.username}`, 15);
        }).catch(err => {
            debug.error("Error sniping messages:\n", err);
            channel.send(randomRuntimeError());
        })
    }
}

export const command: Command = new Command(
    {
        names: ['snipe'],
        info: 'Removes past messages from a specific user in the current channel.',
        usage: '{{prefix}}snipe { user }',
        examples: ['{{prefix}}snipe @Xetera'],
        category: 'Moderation',
        expects: [{type: ArgType.Member}, {type: ArgType.Number, options: {optional: true}}],
        run: run,
        userPermissions: UserPermissions.Moderator,
        clientPermissions: ['MANAGE_MESSAGES']
    }
);
