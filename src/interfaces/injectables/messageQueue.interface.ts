import {Channel, Guild, GuildMember, Message} from "discord.js";
import {ITracklist} from "./tracklist.interface";
import {IMuteQueue} from "./muteQueue.interface";

export interface CachedMessage extends Message {
    sent : Date;
}
export abstract class IMessageQueue {
    trackList: ITracklist;
    muteQueue: IMuteQueue;
    // db: IDatabase;
    queue: Map<string, CachedMessage[]>;
    bufferLength: number;

    abstract add(msg: CachedMessage): void;
    abstract removeUsersRecentMessages(member: GuildMember): void;
    abstract checkLockdown(guild: Guild): boolean;
    abstract getQueue(channel: Channel): void;
}
