import * as Discord from 'discord.js'
import {Database} from "../../database/Database";
import {GuildMember} from "discord.js";
import {underline} from "../../utility/Markdown";
import gb from "../../misc/Globals";

export default function ignore(message : Discord.Message, member : GuildMember, database : Database) {
    if (member === undefined){
        return message.channel.send(`Couldn't find a mentioned member.`);
    }
    else if (member.id === member.client.user.id)
        // could potentially make the name variable if we add a change name feature
        return message.channel.send(`${gb.emojis.get('alexa_hurr')} heY aLeXa, PlEasE iGnOrE <@${gb.ownerID}>`);
    else if (member.hasPermission('ADMINISTRATOR'))
        return message.channel.send(`I have a really hard time ignoring admins, sorry.`);


    const status = database.getIgnored(member);
    database.setIgnored(member, !status).then((state: boolean) => {
        if (state)
            message.channel.send(`Ignoring everything from ${member.user.username}.`);
        else
            message.channel.send(`Unignored ${member.user.username}`);
    });
}
