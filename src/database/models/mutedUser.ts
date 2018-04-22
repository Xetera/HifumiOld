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

@Entity({name: 'muted_users'})
export class MutedUser {
    @PrimaryColumn('varchar')
    id: string;

    @PrimaryColumn()
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
