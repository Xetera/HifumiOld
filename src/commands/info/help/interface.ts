export interface Command {
    name: string;
    type:string;
    info:string;
    usage?: string;
    example?:string;
    arguments?: string;
    commands?: Command[];
    permissions?: 'MOD' | 'ADMIN' | 'OWNER'
}

export interface Help {
    categories: string[];
    commands: Command[]
}