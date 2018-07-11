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

@Entity({name: 'macros'})
export class Macro {
    @Column()
    creator_id: string;

    @PrimaryColumn()
    @ManyToOne(type => Guild, guild => guild.id, {
        nullable: false
    })
    @JoinColumn({name: 'guild_id', referencedColumnName: 'id'})
    guild_id: string;

    @Column({nullable: true})
    guild_name: string;

    @PrimaryColumn()
    macro_name: string;

    @Column({nullable: true})
    macro_content: string;

    @Column('varchar', {array: true, nullable: true})
    macro_links: string[];

    @Column()
    date_created: Date;
}
