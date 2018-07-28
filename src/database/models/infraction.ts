import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";
import 'reflect-metadata';
import {Guild} from "./guild";

@Entity({name: 'infractions'})
export class Infraction {
    @PrimaryGeneratedColumn()
    infraction_id: string;

    @Column()
    target_id: string;

    @Column()
    @ManyToOne(type => Guild, guild => guild.id, {
        nullable: false
    })
    @JoinColumn({name: 'guild_id', referencedColumnName: 'id'})
    guild_id: string;

    @Column({nullable: true})
    guild_name: string;

    @Column()
    staff_id: string;

    @Column({nullable: true})
    staff_name: string;

    @Column()
    infraction_reason: string;

    @Column({default: 0})
    infraction_weight: number;

    @Column({default: new Date()})
    infraction_date: Date;

    @Column()
    expiration_date: Date;
}
