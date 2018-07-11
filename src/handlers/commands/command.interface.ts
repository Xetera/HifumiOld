import {Message, PermissionResolvable} from "discord.js";
import {HelpCategories} from "../../commands/info/help/help.interface";
import {ArgOptions} from "../../decorators/expects";

export interface ICommand {
    /**
     * @description Names and aliases | [Name, ...aliases]
     */
    names: string[];
    /**
     * @description Information on how the command is ued
     */
    info: string;
    /**
     * @description Template of how the command is used
     */
    usage: string;
    /**
     * @description Array of examples of use cases
     */
    examples: string[];
    /**
     * @description category that the command
     */
    category: HelpCategories;
    /**
     * @description Arguments required by the command in order as a tuple
     * @description ArgType[] is used for variable input type
     * @description ArgType.None if no args are required
     *
     * @example [[ArgType.Member, ArgType.Channel], ArgType.Message]
     */
    expects: (ArgOptions | ArgOptions[])[];
    /**
     * @description Implementation of the command
     */
    run: (message: Message, input: any) => any;
    /**
     * @description Permissions required by the user to run this command
     */
    userPermissions?: UserPermissions;
    /**
     * @description Permissions the bot needs to run the command
     */
    clientPermissions?: PermissionResolvable[];
    /**
     * @description Self descriptive
     */
    ownerOnly?: boolean;
    /**
     * @description Whether the command should show up in $help
     */
    hidden?: boolean;
}

export enum UserPermissions {
    BotOwner = 'Bot Owner',
    GuildOwner = 'Guild Owner',
    Administrator = 'Administrator',
    Moderator = 'Ban Members',
    None = '',
}
