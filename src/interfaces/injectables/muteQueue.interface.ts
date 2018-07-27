import Timer = NodeJS.Timer;
import {Guild, GuildMember, Role} from "discord.js";
import {Offense} from "../../moderation/interfaces";

export abstract class IMutedMember {
    name: string;
    muteDate: Date;
    timeout?: Timer;
    muted: boolean;
    member: GuildMember;
    mutedBy: GuildMember;
    role: Role;
    unmuteDate: Date;
    reason: string;
    duration: number;
    muteQueue: IMuteQueue;

    abstract muteUser(): void ;
    abstract cancelUnmute(): void;
}

export abstract class IMuteQueue {
    queue: Map<string, IMutedMember[]>;
    //  group of raiders, currently not functioning
    raiders: Map<string, IMutedMember[]>;

    abstract async add(member: GuildMember, mutedBy: GuildMember, unmuteDate: Date, reason: string | Offense, duration?: number): Promise<boolean>;
    abstract getMutedUsers(guild: Guild): string;
    abstract getMutedUserCount(guild: Guild): number;
}


