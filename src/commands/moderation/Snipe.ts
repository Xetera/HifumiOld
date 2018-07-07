import * as Discord from 'discord.js'
import {Collection, GuildMember, Message} from "discord.js";
import {randomRuntimeError} from "../../interfaces/Replies";
import {debug} from '../../utility/Logging'
import {safeGetArgs} from "../../utility/Util";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import moment = require("moment");
/*
* Removes a user's past messages in a certain channel
* */
export default async function snipe(message: Message, input: [GuildMember, (number | undefined)]){
    const target = <GuildMember> input.shift()!;
    const limit = safeGetArgs(input, 50);
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
