import {
    Entity,
    Column,
    PrimaryColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";
import 'reflect-metadata';
import {Guild} from "./guild";

@Entity({name: 'watchlist'})
export class Watchlist {
    @PrimaryColumn()
    user_id: string;

    @PrimaryColumn()
    @ManyToOne(type => Guild, guild => guild.id, {
        nullable: false
    })
    @JoinColumn({name: 'guild_id', referencedColumnName: 'id'})
    guild_id: string;

    @Column()
    guild_name: string;

    @Column()
    ban_reason: string;

    @Column({default: 50})
    certainty: number;

    @Column()
    join_date: Date;

    @Column({default: new Date()})
    ban_date: Date;
}
