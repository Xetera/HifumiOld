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
import {User} from "./user";

@Entity({name: 'muted_users'})
export class MutedUser {
    @PrimaryGeneratedColumn()
    mute_id: number;

    @ManyToMany(() => User, user => user.id)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user_id: string;


    @ManyToOne(type => Guild, guild => guild.id, {
        nullable: false
    })
    @JoinColumn({name: 'guild_id', referencedColumnName: 'id'})
    guild_id: string;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;
}
