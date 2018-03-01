import * as Discord from 'discord.js'
import {Collection} from "discord.js";
import * as dbg from "debug";
import {randomRuntimeError} from "../../handlers/Replies";

export const debug = {
    silly  : dbg('Bot:Snipe:Silly'),
    info   : dbg('Bot:Snipe:Info'),
    warning: dbg('Bot:Snipe:Warning'),
    error  : dbg('Bot:Snipe:Error')
};
/*
* Removes a user's past messages in a certain channel
* */
export default function snipe(member: Discord.GuildMember, channel : Discord.Channel, messageCount:number = 100){
    if (channel instanceof Discord.TextChannel){
        channel.fetchMessages().then((messages: Collection<Discord.Snowflake, Discord.Message>) => {
            const userMessages = messages.filter((value, key, collection) => {
                return value.author.id === member.user.id;
            });
            channel.bulkDelete(userMessages);
            debug.info(
                `Deleted ${userMessages.array().length} messages from ${member.nickname||member.user.username} ` +
                `in [${member.guild.name}:${channel.name}].`
            );
        }).catch(err => {
            debug.error("Error sniping messages:\n", err);
            channel.send(randomRuntimeError());
        })
    }
}