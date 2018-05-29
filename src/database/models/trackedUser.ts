import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    PrimaryColumn,
    OneToMany,
    JoinTable,
    ManyToOne,
    JoinColumn
} from "typeorm";
import {User} from "./user";
import 'reflect-metadata';
import {Guild} from "./guild";

@Entity({name: 'tracked_users'})
export class TrackedUser {
    @PrimaryGeneratedColumn()
    user_id: string;

    @Column()
    @ManyToOne(type => Guild, guild => guild.id, {
        nullable: false
    })
    @JoinColumn({name: 'guild_id', referencedColumnName: 'id'})
    guild_id: string;

    @Column()
    join_date: Date;
}
