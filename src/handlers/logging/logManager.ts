import {
    Channel, Guild, GuildAuditLogs, GuildAuditLogsEntry, GuildMember, Message, RichEmbed, TextChannel,
    User, VoiceChannel
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

// static class
export class LogManager {


    private static waitForAuditLogs(guild: Guild, func: (logs: GuildAuditLogs) => any){
        setTimeout(() => guild.fetchAuditLogs().then((logs: GuildAuditLogs) => func(logs)), 1000);
    }

    private static async logWarning(guild: Guild, embed: RichEmbed|string, action: string){
        const channelId : string = await gb.instance.database.getWarningsChannel(guild.id);
        if (!channelId)
            return void debug.info(`Could not log a ${action ? action + ' action' : 'message'} in ${guild.name}, missing warnings channel`, 'LogManager');
        const warningsChannel = guild.channels.get(channelId);
        if (!warningsChannel){
            // User probably deleted the channel and didn't update their logs setting
            return void debug.error(`Could not resolve a warnings channel saved in the database`, `LogManager`);
        }
        if (warningsChannel instanceof TextChannel){
            warningsChannel.send(embed);
            debug.silly(`Logged a ${action ? action + ' action' : 'warning'} in ${guild.name}`, 'LogManager');
            return;
        }
        return void debug.error(`Warning channel for ${guild.name} was not recorded as TextChanel.`, 'LogManager');
    }

    private static async logMessage(guild: Guild, embed: RichEmbed|string, action: string){
        const channelId : string = await gb.instance.database.getLogsChannel(guild.id);
        if (!channelId)
            return void debug.info(`Could not log a ${action ? action + ' action' : 'message'} in ${guild.name}, missing logs channel`, 'LogManager');
        const logsChannel = guild.channels.get(channelId);
        if (!logsChannel){
            // User probably deleted the channel and didn't update their logs setting
            debug.error(channelId);
            return void debug.error(`Could not resolve a logs channel saved in the database`, `Database`);
        }
        if (logsChannel instanceof TextChannel){
            logsChannel.send(embed);
            debug.silly(`Logged a ${action ? action + ' action' : 'message'} in ${guild.name}`, 'LogManager');
            return;
        }
        return void debug.error(`Log channel for ${guild.name} was not recorded as TextChanel.`, 'LogManager');
    }

    public static logMutedUser(member: GuildMember, mutedBy: GuildMember, reason: string, duration: number){
        LogManager.logWarning(member.guild, logMutedEmbed(member, mutedBy, reason, duration), 'mute');
    }

    public static logMemberJoin(member: GuildMember){
        LogManager.logMessage(member.guild, logMemberJoinEmbed(member), 'member join');
    }

    public static logMemberLeave(member: GuildMember){
        LogManager.logMessage(member.guild, logMemberLeaveEmbed(member), 'member leave');
    }

    public static logBan(guild:Guild, member: User, banningUser?: GuildMember){
        // race condition but audit log should be winning 99% of the time
        LogManager.waitForAuditLogs(guild, (audit: GuildAuditLogs) => {
            const entry = audit.entries.first();
            if (entry.reason && entry.reason.includes('<TRACKED>'))
                return; // this is a tracked member ban, we don't want to log it normally
            LogManager.logWarning(guild, logBanEmbed(member, entry.reason, banningUser ? banningUser.user : entry.executor), 'member ban')
        });

    }

    public static logTrackedBan(guild: Guild, member: User, offense: Offense){
        if (offense === Offense.Spam)
            LogManager.logWarning(guild, logWatchlistSpamBanEmbed(member), 'tracked spam ban');
        else if (offense === Offense.InviteLink)
            LogManager.logWarning(guild, logWatchlistInviteBanEmbed(member), 'tracked invite ban');
    }

    public static logUnban(guild:Guild, user: User){
        LogManager.waitForAuditLogs(guild, (audit: GuildAuditLogs) => {
            const auditEntries = audit.entries;
            const unbanningStaff: User = auditEntries.first().executor;
            const originalBan: GuildAuditLogsEntry | undefined = auditEntries.array().find(entry =>
                entry.target === user && entry.action === 'MEMBER_BAN_ADD'
            );
            if (!originalBan)
                debug.error(`Could not find the original ban reason for unbanned member in ${guild.name}`);
            const banningStaff: User | 'unknown' = originalBan ? originalBan.executor : 'unknown';
            LogManager.logWarning(guild, logUnbanEmbed(user, unbanningStaff, banningStaff, originalBan ? originalBan.reason : 'unknown'), 'member unban');
        });
    }

    public static logChannelCreate(channel: Channel){
        if (!(channel instanceof TextChannel) && !(channel instanceof VoiceChannel))
            return void debug.warning(`A new DM channel was created with a user.`, `onChannelCreate`);

        LogManager.waitForAuditLogs(channel.guild, (audit: GuildAuditLogs) => {
            const creator = audit.entries.first().executor;
            LogManager.logMessage(channel.guild, logChannelCreateEmbed(channel, creator, channel.name), 'channel create');
        });
    }

    public static logChannelDelete(channel: Channel){
        if (!(channel instanceof TextChannel) && !(channel instanceof VoiceChannel))
            return;
        LogManager.waitForAuditLogs(channel.guild, (audit: GuildAuditLogs) => {
            const creator = audit.entries.first().executor;
            LogManager.logMessage(channel.guild, logChannelDeleteEmbed(channel, creator, channel.name), 'channel delete');
        });
    }

    public static logPingEveryoneAttempt(member: GuildMember, channel: Channel, content: string){
        LogManager.logWarning(member.guild, logEveryonePingEmbed(member, channel, content), 'everyone ping');
    }

    public static logMentionSpam(message: Message){
        LogManager.logWarning(message.member.guild,  logMentionSpamEmbed(
            message.member,
            message.channel,
            message.content,
            message.mentions.members.array()
        ), '')
    }

    public static logCommandExecution(message: Message, command: string){
        LogManager.logMessage(message.guild, logCommandExecutionEmbed(message.member, command), 'command execution');
    }
}
