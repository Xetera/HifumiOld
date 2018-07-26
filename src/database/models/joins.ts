import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import {Guild} from "./guild";
import 'reflect-metadata';

@Entity({name: 'guild_joins'})
export class Joins {
    @PrimaryGeneratedColumn()
    join_id: number;

    @Column()
    user_id: number;

    @PrimaryColumn()
    @ManyToOne(() => Guild, guild => guild.id, {
        nullable: false
    })
    @JoinColumn({name: 'guild_id', referencedColumnName: 'id'})
    guild_id: string;

    @Column()
    join_date: Date;

    @Column({nullable: true})
    leave_date: Date;
}
