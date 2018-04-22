import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany, JoinTable} from "typeorm";
import {User} from "./user";
import 'reflect-metadata';

@Entity({name: 'guilds'})
export class Guild {
    @PrimaryColumn('varchar', {unique: true})
    id: string;

    @OneToMany(type => User, user => user.guild_id)
    @JoinTable({name: 'guild_users'})
    users: User[];

    @Column('character', {default: '$', length: 1})
    prefix: string;

    @Column({default: false})
    allows_invites: boolean;

    @Column({nullable: true})
    welcome_channel: string;

    @Column({nullable: true})
    warnings_channel: string;

    @Column({nullable: true})
    logs_channel: string;

    // channel for easy chatting using cleverbot
    @Column({nullable: true})
    chat_channel: string;

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
    @Column({default: true})
    hints: boolean;


    // Whether Hifumi includes gif reactions
    // in some of her commands
    @Column({default: true})
    reactions: boolean;


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
