import {Entity, Column, PrimaryColumn} from "typeorm";
import 'reflect-metadata';

export enum LoggingChannelType{
    JOINS = 'joins_logging_channel',
    LEAVES = 'leave_logging_channel',
    MUTES = 'mute_logging_channel',
    INVITES = 'invite_logging_channel',
    BANS = 'ban_logging_channel',
    UNBANS = 'unban_logging_channel',
    CHANNEL_MANAGENT = 'channel_management_logging_channel',
    SUGGESTIONS = 'suggestion_logging_channel',
    PINGS = 'ping_logging_channel',
    SPAM = 'spam_logging_channel',
    COMMANDS = 'command_logging_channel'
}

@Entity({name: 'guilds'})
export class Guild {
    @PrimaryColumn('varchar', {unique: true})
    id: string;

    @Column()
    name: string;

    @Column('character', {default: process.env.DEFAULT_PREFIX || '$', length: 1})
    prefix: string;

    @Column({default: true})
    enabled: boolean;

    @Column({default: true})
    allows_invites: boolean;

    @Column({default: false})
    spam_filter: boolean;

    @Column({nullable: true})
    welcome_message: string;

    /* Channel Destinations */
    @Column({nullable: true})
    welcome_channel: string;

    @Column({nullable: true})
    warnings_channel: string;

    @Column({nullable: true})
    logs_channel: string;

    @Column({nullable: true})
    chat_channel: string;

    @Column({nullable: true})
    suggestions_channel: string;

    /* TODO: $logs update*/
    @Column({nullable: true})
    joins_logging_channel: string;

    @Column({nullable: true})
    leave_logging_channel: string;

    @Column({nullable: true})
    mute_logging_channel: string;

    @Column({nullable: true})
    invite_logging_channel: string;

    @Column({nullable: true})
    ban_logging_channel: string;

    @Column({nullable: true})
    unban_logging_channel: string;

    @Column({nullable: true})
    channel_management_logging_channel: string;

    @Column({nullable: true})
    suggestion_logging_channel: string;

    @Column({nullable: true})
    ping_logging_channel: string;

    @Column({nullable: true})
    spam_logging_channel: string;

    @Column({nullable: true})
    command_logging_channel: string;
    /*END $logs update*/

    @Column({nullable: true})
    mute_role: string;

    /* Invite Settings */
    @Column({default: 4})
    invite_warn_threshold: number;

    @Column({default: 5})
    invite_ban_threshold: number;

    // The maximum amount of infractions you can
    @Column({default: 3})
    infraction_limit: number;

    @Column({default: false})
    lockdown: boolean;

    @Column({default: 0})
    cleverbot_calls: number;

    @Column({default: false})
    premium: boolean;

    // WIP, guild visibility in the guilds list
    @Column({default: true})
    visible: boolean;

    // Toggles 'did you mean' replies
    @Column({default: false})
    hints: boolean;

    // Whether Hifumi includes gif reactions
    // in some of her commands
    @Column({default: true})
    reactions: boolean;

    @Column({default: false})
    tracking_new_members: boolean;



    /* Stats */
    @Column({default: 0})
    users_banned: number;

    @Column({default: 0})
    users_muted: number;

    @Column({default: 0})
    spam_deleted: number;

    @Column({default: 0})
    lockdowns: number;

}
