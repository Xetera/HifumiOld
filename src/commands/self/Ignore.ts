import * as Discord from 'discord.js'
import {Database} from "../../database/Database";
import {GuildMember} from "discord.js";
import {underline} from "../../utility/Markdown";
import gb from "../../misc/Globals";
import {User} from "../../database/models/user";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";

export default async function ignore(message : Discord.Message, args: string[]){
    if (!args.length){
        return handleInvalidParameters(message.channel, 'ignore');
    }
    const memberId
    const member = message.mentions.members.first();
    if (member === undefined){
        return handleFailedCommand(message.channel, `Couldn't find a mentioned member.`);
    }
    else if (member.id === member.client.user.id)
        // could potentially make the name variable if we add a change name feature
        return message.channel.send(`${gb.emojis.get('alexa_hurr')} heY hiFuMi, PlEasE iGnOrE <@${gb.ownerID}>`);
    else if (member.hasPermission('ADMINISTRATOR'))
        return handleFailedCommand(message.channel, `I have a really hard time ignoring admins, sorry.`);

    const status = await gb.instance.database.getUserIgnore(member);
    await gb.instance.database.setUserIgnore(member, !status).then((state: Partial<User>) => {
        if (state.ignoring)
            message.channel.send(`Ignoring everything from ${member.user.username}.`);
        else
            message.channel.send(`Unignored ${member.user.username}`);
    });
}
