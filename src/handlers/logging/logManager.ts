import {
    Channel, Guild, GuildAuditLogs, GuildAuditLogsEntry, GuildMember, RichEmbed, TextChannel,
    User
} from "discord.js";
import {debug} from "../../utility/Logging";
import muteDMEmbed from "../../embeds/moderation/muteDMEmbed";
import logMutedEmbed from "../../embeds/logging/logMuteEmbed";
import gb from "../../misc/Globals";
import logBanEmbed from "../../embeds/logging/logBanEmbed";
import logMemberJoinEmbed from "../../embeds/logging/logMemberJoinEmbed";
import logMemberLeaveEmbed from "../../embeds/logging/logMemberLeaveEmbed";
import logUnbanEmbed from "../../embeds/logging/logUnbanEmbed";

export class LogManager {
    public static logWarning(guild: Guild, message: string, extra?: string){
        /*
        const channel = ''
        const guildName = ''
        if (!(channel instanceof TextChannel)){
            const guildName = channel.client.guilds.get(channel.id);
            return debug.error(`Could not log ${message} in guild '${guildName}'`, 'LogManager');
        }
        */
    }

    private static logToGuild(guild: Guild, embed: RichEmbed|string, action?: string){
        const logsChannel : Channel | undefined = gb.instance.database.getLogsChannel(guild.id);
        if (!logsChannel)
            return void debug.info(`Could not log a ${action ? action + ' action' : 'message'} in ${guild.name}, missing logs channel`);
        if (logsChannel instanceof TextChannel){
            logsChannel.send(embed);
            return;
        }
        return void debug.error(`Log channel for ${guild.name} was not recorded as TextChanel.`);
    }

    public static logMutedUser(member: GuildMember){
        LogManager.logToGuild(member.guild, logMutedEmbed(member), 'mute');
    }

    public static logMemberJoin(member: GuildMember){
        LogManager.logToGuild(member.guild, logMemberJoinEmbed(member), 'member join');
    }

    public static logMemberLeave(member: GuildMember){
        LogManager.logToGuild(member.guild, logMemberLeaveEmbed(member), 'member leave');
    }

    public static logBan(guild:Guild, member: User){
        guild.fetchAuditLogs().then(audit => {
            const banReason = audit.entries.first().reason;
            LogManager.logToGuild(guild, logBanEmbed(member, banReason), 'member ban')
        });
    }

    public static logUnban(guild:Guild, user: User){
        guild.fetchAuditLogs().then(audit => {
            const auditEntries = audit.entries;
            const staff: User = auditEntries.first().executor;
            const originalBan: GuildAuditLogsEntry | undefined = auditEntries.array().find(entry =>
                entry.target === user && entry.action === 'MEMBER_BAN_ADD'
            );
            if (!originalBan)
                return void debug.error(`Could not find the original ban reason for unbanned member in ${guild.name}`);
            LogManager.logToGuild(guild, logUnbanEmbed(user, staff, originalBan.reason), 'member unban');
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