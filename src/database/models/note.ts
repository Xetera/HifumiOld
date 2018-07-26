import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";
import 'reflect-metadata';
import {Guild} from "./guild";

@Entity({name: 'notes'})
export class Note {
    @PrimaryGeneratedColumn()
    note_id: string;

    @Column()
    target_id: string;

    @Column()
    @ManyToOne(() => Guild, guild => guild.id, {
        nullable: false
    })
    @JoinColumn({name: 'guild_id', referencedColumnName: 'id'})
    guild_id: string;

    @Column()
    guild_name: string;

    @Column()
    staff_id: string;

    @Column()
    staff_name: string;

    @Column()
    note_content: string;

    @Column()
    note_date: Date;
}
