import {Message} from "discord.js";

export type userId = string;
export type messageId = string;

export interface ICachedGuild {
    prefix: string;
    users: ICachedUser[] // this is going
    blacklisted_links: string[];
    whitelisted_invites: string[];
    welcome_channel: string;
    logs_channel : string;
    warnings_channel : string;
    lockdown: boolean;
    welcomeMessages: Map<userId, Message>;
}

export function isICachedGuild(guild: any): guild is ICachedGuild {
    return 'prefix' in guild;
}

export interface ICachedUser {
    id : string;
    guild_id: string;
    ignoring: boolean;
}


