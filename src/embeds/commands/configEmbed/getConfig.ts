import {Guild as DiscordGuild, RichEmbed} from "discord.js";
import {Guild as DBGuild} from "../../../database/models/guild";


export default function getSettingsEmbed(guild: DiscordGuild, settings: DBGuild) {
    const joins = guild.channels.get(settings.joins_logging_channel);
    const leaves = guild.channels.get(settings.leave_logging_channel);
    const commands = guild.channels.get(settings.command_logging_channel);
    const suggestionsLogs = guild.channels.get(settings.suggestion_logging_channel);
    const mutes = guild.channels.get(settings.mute_logging_channel);
    const invites = guild.channels.get(settings.invite_logging_channel);
    const pings = guild.channels.get(settings.ping_logging_channel);
    const spam = guild.channels.get(settings.spam_logging_channel);
    const bans = guild.channels.get(settings.ban_logging_channel)
    const unbans = guild.channels.get(settings.unban_logging_channel);
    const channels = guild.channels.get(settings.channel_management_logging_channel);

    const welcome = guild.channels.get(settings.welcome_channel);
    const chat = guild.channels.get(settings.chat_channel);
    const suggestions = guild.channels.get(settings.suggestions_channel);

    return new RichEmbed()
        .setTitle(`${guild.name}'s Settings`)
        .setColor(`#edffac`)
        .setThumbnail(`http://icons.iconarchive.com/icons/artua/mac/512/Setting-icon.png`)
        .setDescription(
            `**Prefix:** ${settings.prefix}\n` +
            `**Premium:** ${settings.premium ? 'Yes!' : 'No'}\n` +
            `**Hints:** ${settings.hints ? 'Enabled' : 'Disabled'}\n` +
            `**Reactions:** ${settings.reactions ? 'Enabled' : 'Disabled'}\n` +
            `**Server Visibility:** ${settings.visible ? 'Public' : 'Hidden'}\n` +
            `**Strike Limit:** ${settings.infraction_limit}\n` +
            `**New Member Tracking:** ${settings.tracking_new_members ? 'Enabled' : 'Disabled'}\n` +
            `**Invites:** ${settings.allows_invites ? 'Allowed' : 'Not Allowed'}\n` +
            `${!settings.allows_invites ? `↳ **Warning For Invites At:** ${settings.invite_warn_threshold} invites\n` : ''}` +
            `${!settings.allows_invites ? `↳ **Banning For Invites At:** ${settings.invite_ban_threshold } invites\n` : ''}\n` +
            `__Settings__`)
        .addField(`Logs: Joins`, joins ? joins : 'Not set', true)
        .addField(`Logs: Leaves`, leaves ? leaves : 'Not set', true)
        .addField(`Logs: Commands`, commands ? commands : 'Not set', true)
        .addField(`Logs: Suggestions`, suggestionsLogs ? suggestionsLogs : 'Not set', true)
        .addField(`Logs: Channel Updates`, channels ? channels : 'Not set', true)
        .addBlankField()
        .addField(`Warnings: Mutes`, mutes ? mutes : 'Not set', true)
        .addField(`Warnings: Invites`, invites ? invites : 'Not set', true)
        .addField(`Warnings: Pings`, pings ? pings : 'Not set', true)
        .addField(`Warnings: Spam`, spam ? spam : 'Not set', true)
        .addField(`Warnings: Bans`, bans ? bans : 'Not set', true)
        .addField(`Warnings: Unbans`, unbans ? unbans : 'Not set', true)
        .addBlankField()
        .addField(`Welcome Channel`, welcome ? welcome : 'Not set', true)
        .addField(`Chat Channel`, chat ? chat : 'Not set', true)
        .addField(`Suggestions Channel`, suggestions ? suggestions : 'Not set', true)
        .setFooter(`=> ${settings.prefix}help settings <= for more info`)
}
