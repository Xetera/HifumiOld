import {
    Channel, Guild, GuildAuditLogs, GuildAuditLogsEntry, GuildMember, RichEmbed, TextChannel,
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

// static channel
export class LogManager {


    private static logWarning(){

    }
    private static waitForAuditLogs(func: () => any){
        setTimeout(() => func(), 500);
    }

    private static logToGuild(guild: Guild, embed: RichEmbed|string, action?: string){
        const logsChannel : Channel | undefined = gb.instance.database.getLogsChannel(guild.id);
        if (!logsChannel)
            return void debug.info(`Could not log a ${action ? action + ' action' : 'message'} in ${guild.name}, missing logs channel`, 'LogManager');
        if (logsChannel instanceof TextChannel){
            logsChannel.send(embed);
            debug.silly(`Logged a ${action ? action + ' action' : 'message'} in ${guild.name}`, 'LogManager');
            return;
        }
        return void debug.error(`Log channel for ${guild.name} was not recorded as TextChanel.`, 'LogManager');
    }

    public static logMutedUser(member: GuildMember, mutedBy: GuildMember, reason: string, duration: number){
        LogManager.logToGuild(member.guild, logMutedEmbed(member, mutedBy, reason, duration), 'mute');
    }

    public static logMemberJoin(member: GuildMember){
        LogManager.logToGuild(member.guild, logMemberJoinEmbed(member), 'member join');
    }

    public static logMemberLeave(member: GuildMember){
        LogManager.logToGuild(member.guild, logMemberLeaveEmbed(member), 'member leave');
    }

    public static logBan(guild:Guild, member: User){
        // race condition but audit log should be winning 99% of the time
        LogManager.waitForAuditLogs(() => {
            guild.fetchAuditLogs().then(audit => {
                const entry = audit.entries.first();
                if (entry.reason && entry.reason.indexOf('<TRACKED>') >= 0)
                    return; // this is a tracked member ban, we don't want to log it normally
                LogManager.logToGuild(guild, logBanEmbed(member, entry.reason, entry.executor), 'member ban')
            });
        })

    }

    public static logTrackedBan(guild: Guild, member: User, offense: Offense){
        if (offense === Offense.Spam)
            LogManager.logToGuild(guild, logWatchlistSpamBanEmbed(member));
        else if (offense === Offense.InviteLink)
            LogManager.logToGuild(guild, logWatchlistInviteBanEmbed(member));
    }

    public static logUnban(guild:Guild, user: User){
        LogManager.waitForAuditLogs(() => {
            guild.fetchAuditLogs().then(audit => {
                const auditEntries = audit.entries;
                const unbanningStaff: User = auditEntries.first().executor;
                const originalBan: GuildAuditLogsEntry | undefined = auditEntries.array().find(entry =>
                    entry.target === user && entry.action === 'MEMBER_BAN_ADD'
                );
                if (!originalBan)
                    return void debug.error(`Could not find the original ban reason for unbanned member in ${guild.name}`);
                const banningStaff: User = originalBan.executor;
                LogManager.logToGuild(guild, logUnbanEmbed(user, unbanningStaff, banningStaff, originalBan.reason), 'member unban');
            });
        });
    }

    public static logChannelCreate(channel: Channel){
        if (!(channel instanceof TextChannel) && !(channel instanceof VoiceChannel))
            return void debug.warning(`New channel was created with the type ${channel.type}`);

        LogManager.waitForAuditLogs(() => {
            channel.guild.fetchAuditLogs().then(audit => {
                const creator = audit.entries.first().executor;
                LogManager.logToGuild(channel.guild, logChannelCreateEmbed(channel, creator, channel.name), 'channel create');
            });
        })
    }

    public static logChannelDelete(channel: Channel){
        if (!(channel instanceof TextChannel) && !(channel instanceof VoiceChannel))
            return;
        LogManager.waitForAuditLogs(() => {
            channel.guild.fetchAuditLogs().then(audit => {
                const creator = audit.entries.first().executor;
                LogManager.logToGuild(channel.guild, logChannelDeleteEmbed(channel, creator, channel.name), 'channel delete');
            });
        });
    }
    /**
     *
     * @param {"discord.js".Guild} guild
     * @param {string} message
     */
    public static logCritical(guild: Guild, message: string){

    }
}
