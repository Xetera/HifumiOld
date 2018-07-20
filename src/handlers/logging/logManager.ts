import {
    Channel,
    DiscordAPIError,
    Guild,
    GuildAuditLogs, GuildAuditLogsActions,
    GuildAuditLogsEntry,
    GuildMember,
    Message,
    Permissions,
    RichEmbed,
    TextChannel,
    User,
    VoiceChannel
} from "discord.js";
import {debug, log} from "../../utility/Logging";
import muteDMEmbed from "../../embeds/moderation/muteDMEmbed";
import logMutedEmbed from "../../embeds/logging/logMuteEmbed";
import gb from "../../misc/Globals";
import logBanEmbed from "../../embeds/logging/logBanEmbed";
import logMemberJoinEmbed from "../../embeds/logging/logMemberJoinEmbed";
import logMemberLeaveEmbed from "../../embeds/logging/logMemberLeaveEmbed";
import logUnbanEmbed from "../../embeds/logging/logUnbanEmbed";
import logChannelCreateEmbed from "../../embeds/logging/logChannelCreateEmbed";
import logChannelDeleteEmbed from "../../embeds/logging/logChannelDeleteEmbed";
import logWatchlistSpamBanEmbed from "../../embeds/logging/tracklist/logTracklistSpamBanEmbed";
import {Offense} from "../../moderation/interfaces";
import logWatchlistInviteBanEmbed from "../../embeds/logging/tracklist/logTracklistInviteBanEmbed";
import logEveryonePingEmbed from "../../embeds/logging/warnings/logEveryonePingEmbed";
import logMentionSpamEmbed from "../../embeds/logging/warnings/logMentionSpamEmbed";
import logCommandExecutionEmbed from "../../embeds/logging/logCommandExecutionEmbed";
import {APIErrors} from "../../interfaces/Errors";
import safeSendMessage from "../safe/SafeSendMessage";
import logInviteMessageEmbed from "../../embeds/logging/logInviteMessageEmbed";
import logEditedInviteMessageEmbed from "../../embeds/logging/logEditedInviteMessageEmbed";
import {Suggestion} from "../../database/models/suggestion";
import logNewSuggestionEmbed from "../../embeds/logging/suggestions/logNewSuggestionEmbed";
import {defaultCoreCipherList} from "constants";

enum LogAction {
    JOIN = 'join',
    LEAVE = 'leave',
    COMMAND = 'command',
    SUGGESTION = 'suggestion',
    MUTE = 'mute',
    INVITE = 'invite',
    PING = 'ping',
    SPAM = 'spam',
    BAN = 'ban',
    UNBAN = 'unban',
    CHANNEL_CREATE = 'channel_create',
    CHANNEL_DELETE = 'channel_delete',
    INFRACTION = 'infraction'
}
// static class
export class LogManager {
    private static waitForAuditLogs(guild: Guild, func: (logs: GuildAuditLogs) => any){
        setTimeout(() => {
            guild.fetchAuditLogs()
                .then((logs: GuildAuditLogs) => func(logs))
                .catch(err => {
                    debug.error(`Could not fetch audit logs for server ${guild.name}, missing permissions`,`LogManager`)
                });
        }, 1000);
    }

    private static canLog(channel: TextChannel): boolean{
        return channel.permissionsFor(channel.guild.me).has(['SEND_MESSAGES', 'READ_MESSAGES']);
    }

    private static findExecutor(logs: GuildAuditLogs, action: keyof GuildAuditLogsActions): GuildAuditLogsEntry | undefined {
        const entries = logs.entries.array();
        return entries.find(entry => entry.action === action);
    }

    public static async logWarning(guild: Guild, channelId: string, embed: RichEmbed|string, action: LogAction){
        const warningsChannel = guild.channels.get(channelId);
        if (!warningsChannel) {
            // User probably deleted the channel and didn't update their log setting
            return void debug.error(`Could not resolve a warnings channel saved in the database`, `LogManager`);
        }
        else if (!LogManager.canLog( < TextChannel > warningsChannel)){
           return;
        }
        if (warningsChannel instanceof TextChannel){
            warningsChannel.send(embed);
            debug.silly(`Logged a ${action ? action + ' action' : 'warning'} in ${guild.name}`, 'LogManager');
            return;
        }
        return void debug.error(`Warning channel for ${guild.name} was not recorded as TextChanel.`, 'LogManager');
    }

    public static async logMessage(guild: Guild, channelId: string, embed: RichEmbed|string, action: LogAction){
        const logsChannel = guild.channels.get(channelId);
        if (!logsChannel){
            // User probably deleted the channel and didn't update their log setting
            return void debug.error(`Could not resolve a channel saved in the database`, `LogManager`);
        }
        else if (!LogManager.canLog( < TextChannel > logsChannel)){
            return;
        }
        if (logsChannel instanceof TextChannel){
            safeSendMessage(logsChannel, embed);
            debug.silly(`Logged a ${action ? action + ' action' : 'message'} in ${guild.name}`, 'LogManager');
            return;
        }
        return void debug.error(`Log channel for ${guild.name} was not recorded as TextChanel.`, 'LogManager');
    }

    public static async logMutedUser(member: GuildMember, mutedBy: GuildMember, reason: string, duration: number){
        const channel = await gb.instance.database.getGuildProperty(
            member.guild.id,
            'mute_logging_channel'
        );
        if (!channel)
            return;
        LogManager.logWarning(member.guild, <string> channel, logMutedEmbed(member, mutedBy, reason, duration), LogAction.MUTE);
    }

    public static async logMemberJoin(member: GuildMember){
        const channel = await gb.instance.database.getGuildProperty(
            member.guild.id,
            'joins_logging_channel'
        );
        if (!member.guild.available || !channel)
            return;
        LogManager.logMessage(member.guild, <string> channel, logMemberJoinEmbed(member), LogAction.JOIN);
    }

    public static async  logMemberLeave(member: GuildMember){
        const channel = await gb.instance.database.getGuildProperty(
            member.guild.id,
            'leave_logging_channel'
        );
        if (!member.guild.available || !channel)
            return;
        LogManager.logMessage(member.guild, <string> channel, logMemberLeaveEmbed(member), LogAction.LEAVE);
    }

    public static async logBan(guild:Guild, member: User, banningUser?: GuildMember, recursion?: number){
        if (recursion && recursion > 3){
            return debug.warning(`Could not find a ban log after an ban event was fired in ${guild.name}`);
        }
        const channel = await gb.instance.database.getGuildProperty(
            guild.id,
            'ban_logging_channel'
        );
        if (!guild.available || !channel)
            return;
        // race condition but audit log should be winning 99% of the time
        LogManager.waitForAuditLogs(guild, (audit: GuildAuditLogs) => {
            const entry = LogManager.findExecutor(audit, 'MEMBER_BAN_ADD');

            if (!entry){
                return LogManager.logBan(guild, member, banningUser, recursion || 0);
            }

            if (entry.reason && entry.reason.includes('<TRACKED>'))
                return; // this is a tracked member ban, we don't want to log it normally
            LogManager.logWarning(guild, <string> channel, logBanEmbed(member, entry.reason, banningUser ? banningUser.user : entry.executor), LogAction.BAN)
        });

    }

    public static async logTrackedBan(guild: Guild, member: User, offense: Offense){
        const channel = await gb.instance.database.getGuildProperty(
            guild.id,
            'ban_logging_channel'
        );
        if (guild.available || !channel)
            return;
        if (offense === Offense.Spam)
            LogManager.logWarning(guild, <string> channel, logWatchlistSpamBanEmbed(member), LogAction.BAN);
        else if (offense === Offense.InviteLink)
            LogManager.logWarning(guild, <string> channel, logWatchlistInviteBanEmbed(member), LogAction.BAN);
    }

    public static async logUnban(guild:Guild, user: User, recursion?: number){
        if (recursion && recursion > 3){
            return debug.warning(`Could not find an unban log after an unban event was fired in ${guild.name}`);
        }

        const channel = await gb.instance.database.getGuildProperty(
            guild.id,
            'unban_logging_channel'
        );
        if (!guild.available || !channel)
            return;
        LogManager.waitForAuditLogs(guild, (audit: GuildAuditLogs) => {
            const entry = LogManager.findExecutor(audit, "MEMBER_BAN_REMOVE");
            if (!entry){
                return LogManager.logUnban(guild, user, recursion && recursion + 1 || 0);
            }
            const originalBan: GuildAuditLogsEntry | undefined = audit.entries.array().find(entry =>
                entry.target === user && entry.action === 'MEMBER_BAN_ADD'
            );

            if (!originalBan)
                debug.error(`Could not find the original ban reason for unbanned member in ${guild.name}`);

            const banningStaff = originalBan ? originalBan.executor : 'unknown';
            const banReason    = originalBan ? originalBan.reason : 'unknown';

            LogManager.logWarning(guild, <string> channel,
                logUnbanEmbed(
                    user, entry.executor, banningStaff, banReason, entry.reason
                ),
                LogAction.UNBAN
            );
        });
    }

    public static async logChannelCreate(target: Channel, recursion?: number){
        if (!(target instanceof TextChannel) && !(target instanceof VoiceChannel))
            return void debug.warning(`A new DM channel was created with a user.`, `onChannelCreate`);

        if (recursion && recursion > 3){
            return debug.warning(`Could not find a channel create log after an channel create event was fired in ${target.guild.name}`);
        }

        const channel = await gb.instance.database.getGuildProperty(
            target.guild.id,
            'channel_management_logging_channel'
        );
        if (!target.guild.available || !channel)
            return;


        LogManager.waitForAuditLogs(target.guild, (audit: GuildAuditLogs) => {
            const entry = LogManager.findExecutor(audit, "CHANNEL_CREATE");

            if (!entry){
                return LogManager.logChannelCreate(target, recursion && recursion + 1 || 0);
            }

            const creator = entry.executor;
            LogManager.logMessage(target.guild, <string> channel, logChannelCreateEmbed(target, creator, target.name), LogAction.CHANNEL_CREATE);
        });
    }

    public static async logChannelDelete(target: Channel, recursion?: number){

        if (recursion && recursion > 3){
            return debug.warning(`Could not find a channel create log after an channel create event was fired in ${(<TextChannel> target).guild.name}`);
        }

        if (!(target instanceof TextChannel) && !(target instanceof VoiceChannel))
            return;

        const channel = await gb.instance.database.getGuildProperty(
            target.guild.id,
            'channel_management_logging_channel'
        );
        if (!target.guild.available ||!channel)
            return;

        LogManager.waitForAuditLogs(target.guild, (audit: GuildAuditLogs) => {
            const entry = LogManager.findExecutor(audit, "CHANNEL_DELETE");

            if (!entry){
                return LogManager.logChannelCreate(target, recursion && recursion + 1|| 0);
            }

            const creator = entry.executor;
            LogManager.logMessage(target.guild, <string> channel,  logChannelDeleteEmbed(target, creator, target.name), LogAction.CHANNEL_DELETE);
        });
    }

    public static async logPingEveryoneAttempt(member: GuildMember, channel: Channel, content: string){
        if (!(channel instanceof TextChannel) && !(channel instanceof VoiceChannel))
            return;

        const target = await gb.instance.database.getGuildProperty(
            channel.guild.id,
            'ping_logging_channel'
        );
        if (!member.guild.available ||!target)
            return;
        LogManager.logWarning(member.guild, <string> target, logEveryonePingEmbed(member, channel, content), LogAction.PING);
    }

    public static async logMentionSpam(message: Message){
        const target = await gb.instance.database.getGuildProperty(
            message.guild.id,
            'ping_logging_channel'
        );
        if (!message.guild.available ||!target)
            return

        LogManager.logWarning(message.member.guild, <string> target, logMentionSpamEmbed(
            message.member,
            message.channel,
            message.content,
            message.mentions.members.array()
        ), LogAction.PING)
    }

    public static async logCommandExecution(message: Message, command: string){
        const target = await gb.instance.database.getGuildProperty(
            message.guild.id,
            'command_logging_channel'
        );
        if (!message.guild.available ||!target)
            return;
        LogManager.logMessage(message.guild, <string> target, logCommandExecutionEmbed(message.member, <TextChannel> message.channel, command), LogAction.COMMAND);
    }

    public static async logIllegalInvite(message: Message){
        const target = await gb.instance.database.getGuildProperty(
            message.guild.id,
            'invite_logging_channel'
        );
        if (!message.guild.available ||!target)
            return;
        LogManager.logWarning(message.guild, <string> target, await logInviteMessageEmbed(message), LogAction.INVITE)
    }

    public static async logIllegalEditedInvited(oldM: Message, newM: Message){
        const target = await gb.instance.database.getGuildProperty(
            newM.guild.id,
            'invite_logging_channel'
        );
        if (!newM.guild.available ||!target)
            return;
        LogManager.logWarning(oldM.guild,<string> target, await logEditedInviteMessageEmbed(oldM, oldM, newM.content), LogAction.INVITE)
    }

    public static async logNewSuggestion(member: GuildMember) {
        const target = await gb.instance.database.getGuildProperty(
            member.guild.id,
            'suggestion_logging_channel'
        );
        if (!member.guild.available ||!target)
            return;
        LogManager.logMessage(member.guild,<string> target, await logNewSuggestionEmbed(member), LogAction.SUGGESTION);
    }
}
