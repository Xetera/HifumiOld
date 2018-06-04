import {
    Entity,
    Column,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import {Guild} from "./guild";
import 'reflect-metadata';

@Entity({name: 'ignored_channels'})
export class IgnoredChannel {
    @PrimaryColumn()
    channel_id: string;

    @PrimaryColumn()
    @ManyToOne(() => Guild, guild => guild.id, {
        nullable: false
    })
    @JoinColumn({name: 'guild_id', referencedColumnName: 'id'})
    guild_id: string;

    @Column()
    ignore_date: Date;

    // name, not id. we don't care about id
    @Column()
    ignored_by: string;
}
