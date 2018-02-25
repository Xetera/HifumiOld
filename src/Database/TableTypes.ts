export interface IGuild {
    id: string;
    name: string;
    prefix: string;
    allowsinvites: boolean;
}

export interface IUser {
    id: string;
    name:string;
    guild_id: string;
    invitestrikes: number;
}

export interface IBlacklistedLinks {
    guild_id: string;
    link: string;
}

export interface IWhitelistedInvites {
    guild_id: string;
    link: string;
}