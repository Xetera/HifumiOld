import {
    Entity,
    Column,
    PrimaryColumn,
    ManyToOne,
    JoinColumn, PrimaryGeneratedColumn
} from "typeorm";
import 'reflect-metadata';
import {Guild} from "./guild";

export enum SuggestionStatus {
    APPROVED,
    DENIED,
    ACCEPTED,
    REJECTED,
    AWAITING_APPROVAL
}
@Entity({name: 'suggestions'})
export class Suggestion {
    @PrimaryGeneratedColumn()
    suggestion_id: string;

    // the ID of the suggestion
    // embed sent by Hifumi
    @Column({nullable: true})
    message_id: string;

    @Column({nullable: true})
    channel_id: string;

    @Column()
    suggestion_message: string;

    @Column()
    @ManyToOne(type => Guild, guild => guild.id, {
        nullable: false
    })
    @JoinColumn({name: 'guild_id', referencedColumnName: 'id'})
    guild_id: string;

    @Column()
    guild_name: string;

    @Column()
    user_id: string;

    @Column()
    user_name: string;

    @Column({
        type: 'enum',
        enum: SuggestionStatus,
        default: SuggestionStatus.AWAITING_APPROVAL
    })
    suggestion_status: SuggestionStatus;

    @Column()
    suggestion_date: Date;

    @Column({nullable: true})
    response_date: Date;

    @Column({nullable: true})
    status_reason: string;

    @Column({nullable: true, default: 0})
    upvotes: number;

    @Column({nullable: true, default: 0})
    downvotes: number;
}
