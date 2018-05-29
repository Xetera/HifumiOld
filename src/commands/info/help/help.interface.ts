export interface Command {
    name: string;
    type:string;
    info:string;
    usage: string;
    hidden?: boolean;
    example:string;
    arguments: string;
    permissions?: 'MOD' | 'ADMIN' | 'OWNER'
}

export interface Help {
    categories: string[];
    commands: Command[]
}
