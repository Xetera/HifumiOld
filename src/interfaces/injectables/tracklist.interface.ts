import {Guild, GuildMember, Message} from "discord.js";
import {SecurityLevels} from "../../utility/Settings";
import {Offense} from "../../moderation/interfaces";

export type guildId = string;

export interface TrackedMember extends GuildMember {
    security : SecurityLevels;
    join_date: Date;
    banned: boolean;
}
export abstract class ITracklist {
    members: Map<guildId, TrackedMember[]>;
    trackedMessages: Map<guildId, Message[]>;

    abstract initializeGuilds(): void;
    abstract insertNewGuild(guild: Guild): void;
    abstract getMember(member: GuildMember): TrackedMember | undefined ;
    abstract async add(member: GuildMember): Promise<void>;
    abstract remove(member: GuildMember): void;
    abstract isNewMember(member: TrackedMember|GuildMember): boolean;
    abstract punishNewMember(member: GuildMember, offense: Offense): void;
}




