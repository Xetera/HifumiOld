export interface Command {
    name: string;
    type:string;
    info:string;
    usage: string;
    example:string;
    arguments: string;
    permissions?: 'MOD' | 'ADMIN' | 'OWNER'
}

export interface Help {
    categories: string[];
    commands: Command[]
}
