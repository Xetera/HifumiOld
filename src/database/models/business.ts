import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
    OneToOne, JoinTable, Index, OneToMany
} from "typeorm";
import {Guild} from "./guild";
import 'reflect-metadata';
import {Infraction} from "./infraction";

@Entity({name: 'businesses'})
export class Business {
    @PrimaryGeneratedColumn()
    business_id: string;

    @Column()
    user_id: string;

    @Column()
    revenue: number; //copper per 30 minutes
}
