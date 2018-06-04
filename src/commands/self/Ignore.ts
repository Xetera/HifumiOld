import * as Discord from 'discord.js'
import {Database} from "../../database/Database";
import {Channel, GuildMember, TextChannel} from "discord.js";
import {underline} from "../../utility/Markdown";
import gb from "../../misc/Globals";
import {User} from "../../database/models/user";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {resolveMember} from "../../resolvers/memberResolver";
import {UpdateResult} from "typeorm";

export default async function ignore(message: Discord.Message, input: [GuildMember | Channel]) {
    const [target] = input;
    if (target instanceof GuildMember) {
        if (target.id === gb.ownerID) {
            return handleFailedCommand(message.channel, `${gb.emojis.get('hifumi_durr')} heY hiFuMi, PlEasE iGnOrE Xetera`);
        }

        else if (target.id === message.guild.me.id) {
            return handleFailedCommand(message.channel, `Why would you want me to ignore myself? :(`);
        }

        else if (target.hasPermission('ADMINISTRATOR')) {
            return handleFailedCommand(message.channel, `I have a really hard time ignoring admins, sorry.`);
        }

        else if (message.member.highestRole.comparePositionTo(target.highestRole) < 0 && !message.member.hasPermission('ADMINISTRATOR')) {
            return handleFailedCommand(message.channel, `I can't be forced to ignore users that have a higher role than you.`);
        }

        else if (target.user.bot) {
            return handleFailedCommand(message.channel, `I already ignore everything from bots.`);
        }

        const status = await gb.instance.database.isUserIgnored(target);
        try {
            await gb.instance.database.setUserIgnore(target, !status);
        }
        catch (err) {
            console.log(err);
            return handleFailedCommand(message.channel, `There was an unexpected error while trying to ignore that.`);
        }

        if (!status)
            message.channel.send(`Ignoring everything from ${target.user.username}.`);
        else
            message.channel.send(`Unignored ${target.user.username}`);

    }
    else if (target instanceof TextChannel) {
        if (!message.member.permissionsIn(target).has('SEND_MESSAGES')){
            return handleFailedCommand(message.channel, `I can't ignore a channel you can't send messages in.`);
        }
        const status = await gb.instance.database.getChannelIgnored(message.guild.id, target.id);
        try {
            await gb.instance.database.setChannelIgnored(message.guild.id, target.id, message.member.user.username, !status);
        }
        catch (err){
            console.log(err);
            return handleFailedCommand(message.channel, `There was an unexpected error while trying to ignore that.`);
        }

        if (!status)
            message.channel.send(`Ignoring commands and chats from ${target}.`);
        else
            message.channel.send(`Unignored commands and chats from ${target}`);

    }
    else {
        return handleFailedCommand(message.channel, `I can't ignore that.`)
    }


}
