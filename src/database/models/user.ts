import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
    OneToOne, JoinTable, Index
} from "typeorm";
import {Guild} from "./guild";
import 'reflect-metadata';

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

    @Column({default: false})
    ignoring: boolean;

}
