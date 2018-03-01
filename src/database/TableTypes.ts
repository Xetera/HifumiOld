export interface IGuild {
    id: string;
    name: string;
    prefix: string;
    allowsinvites: boolean;
    default_channel: string;
}

export interface IUser {
    id: string;
    name:string;
    guild_id: string;
    invite_strikes: number;
}

export interface IBlacklistedLinks {
    guild_id: string;
    link: string;
}

export interface IWhitelistedInvites {
    guild_id: string;
    link: string;
}


export function isIGuild(object : any) : object is IGuild {
    return 'id' in object;
}

export function isIUser(object : any): object is IUser{
    return 'guild_id' in object;
}

export function isIBlacklistedLinks(object : any): object is IBlacklistedLinks{
    return 'guild_id' in object;
}

export function isIWhitelistedInvites(object : any): object is IWhitelistedInvites{
    return 'guild_id' in object;
}