import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
    OneToOne, JoinTable, Index, OneToMany
} from "typeorm";
import {Guild} from "./guild";
import 'reflect-metadata';
import {Infraction} from "./infraction";

@Entity({name: 'users'})
export class User {
    @PrimaryColumn()
    id: string;

    @PrimaryColumn()
    @ManyToOne(type => Guild, guild => guild.id, {
        nullable: false
    })
    @JoinColumn({name: 'guild_id', referencedColumnName: 'id'})
    guild_id: string;

    @ManyToMany(t => Guild, guild => guild)
    guilds: Guild[];

    @Column({default: 0})
    invite_strikes: number;

    @Column({default: 0})
    strike_count: number;

    @Column({default: 0})
    history_calls: number;

    @JoinTable()
    @OneToMany(() => Infraction, i => i.infraction_id)
    infractions: Infraction[];

    @Column({default: false})
    ignoring: boolean;

    @Column({default: 0})
    commands_used: number;

    @Column({default: 0})
    macros_used: number;
}
