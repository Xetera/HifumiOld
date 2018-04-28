import * as Discord from 'discord.js'
import {Database} from "../../database/Database";
import {GuildMember} from "discord.js";
import {underline} from "../../utility/Markdown";
import gb from "../../misc/Globals";
import {User} from "../../database/models/user";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {resolveMember} from "../../resolvers/memberResolver";
import {UpdateResult} from "typeorm";

export default async function ignore(message : Discord.Message, input: [GuildMember]){
    const member = input.shift()!;
    console.log(message.member.highestRole.comparePositionTo(member.highestRole))
    if (member.id === gb.ownerID)
        return message.channel.send(`${gb.emojis.get('alexa_hurr')} heY hiFuMi, PlEasE iGnOrE <@${gb.ownerID}>`);

    else if (member.id === message.guild.me.id)
        return handleFailedCommand(message.channel, `Why would you want me to ignore myself? :(`);

    else if (member.hasPermission('ADMINISTRATOR'))
        return handleFailedCommand(message.channel, `I have a really hard time ignoring admins, sorry.`);

    else if (message.member.highestRole.comparePositionTo(member.highestRole) < 0 && !message.member.hasPermission('ADMINISTRATOR')){
        return handleFailedCommand(message.channel, `I can't be forced to ignore users that have a higher role than you.`);
    }

    const status = await gb.instance.database.isUserIgnored(member);

    return gb.instance.database.setUserIgnore(member, !status).then((r: UpdateResult) => {
        if (!status)
            message.channel.send(`Ignoring everything from ${member.user.username}.`);
        else
            message.channel.send(`Unignored ${member.user.username}`);
    });
}
