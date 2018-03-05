import * as Discord from 'discord.js'
import {Database} from "../../database/Database";
import {GuildMember} from "discord.js";

export default function ignore(message : Discord.Message, member : GuildMember, database : Database) {
    if (member === undefined){
        return message.channel.send(`Couldn't find a mentioned member.`);
    }
    const status = database.getIgnored(member);
    database.setIgnored(member, !status).then((state: boolean) => {
        if (state)
            message.channel.send(`Ignoring everything from ${member.user.username}.`);
        else
            message.channel.send(`Unignored ${member.user.username}`);
    });
}
