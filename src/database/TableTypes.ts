import {SecurityLevels} from "../utility/Settings";

export interface IGuild {
    id: string;
    name: string;
    prefix: string;
    allows_invites: boolean;
    welcome_channel: string;
    warnings_channel: string;
    logs_channel: string;
    lockdown: boolean;
    command_hints: boolean;
}

export interface IUser {
    id: string;
    name:string;
    guild_id: string;
    invite_strikes: number;
    ignoring: boolean;
}

export interface IBlacklistedLink {
    guild_id: string;
    link: string;
}

export interface IWhitelistedInvite {
    guild_id: string;
    invite: string;
}

export interface ITrackedUser {
    id: string;
    guild_id: string;
    join_date: Date;
    security: SecurityLevels;
}

export interface IStats {
    guilds: number;
    users_banned: number,
    users_muted: number,
    spam_deleted: number,
    lockdown: number;
}
export function isTrackedUser(object: any) : object is ITrackedUser {
    return 'join_date' in object;
}

export function isIGuild(object : any) : object is IGuild {
    return 'id' in object;
}

export function isIUser(object : any): object is IUser{
    return 'guild_id' in object;
}

export function isIBlacklistedLinks(object : any): object is IBlacklistedLink{
    return 'link' in object;
}

export function isIWhitelistedInvites(object : any): object is IWhitelistedInvite{
    return 'invite' in object;
}
