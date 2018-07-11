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
export type HelpCategories = "Logging"
    | "Info"
    | "Chat"
    | "Utility"
    | "Moderation"
    | "Settings"
    | "Fun"
    | "Embeds"
    | "Suggestions"
    | "Settings"
    | "Economy"
    | "Debug";

export interface Help {
    categories: HelpCategories;
    commands: Command[];
}
