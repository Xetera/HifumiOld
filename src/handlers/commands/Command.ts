import {Guild, Message, PermissionResolvable} from "discord.js";

import {ArgOptions, ArgType} from "../../interfaces/arg.interface";
import {ICommand, UserPermissions} from "../../interfaces/command.interface";
import {HelpCategories} from "../../commands/info/help/help.interface";


export class Command implements ICommand {
    names: string[];
    info: string;
    usage: string;
    examples: string[];
    category: HelpCategories;
    expects: (ArgOptions | ArgOptions[])[];
    run: (message: Message, input: [any]) => any;
    userPermissions?: UserPermissions;
    clientPermissions?: PermissionResolvable[];
    hidden: boolean = false;

    constructor(public command: ICommand){
        this.names = command.names;
        this.info = command.info;
        this.usage = command.usage;
        this.examples = command.examples;
        this.category = command.category;
        this.expects = command.expects;
        this.run = command.run;
        this.userPermissions = command.userPermissions;
        this.clientPermissions = command.clientPermissions;
        if (command.hidden !== undefined){
            this.hidden = command.hidden;
        }
    }

    /**
     * Converts the command usage to readable form
     * @param {string} prefix
     * @returns {string}
     */
    public getUsage(prefix: string): string {
        return this.usage.replace(/{{prefix}}/g, prefix);
    }

    /**
     * Converts the command examples to readable form
     * @param {string} prefix
     * @returns {string}
     */
    public getExamples(prefix: string): string {
        return this.examples.join('\n').replace(/{{prefix}}/g, prefix);
    }

    public getFirstExample(prefix: string): string {
        return this.examples[0].replace(/{{prefix}}/g, prefix);
    }

    public get argLength(){
        // ArgOption[] takes in variable input which means it cannot be option
        return this.expects.filter(arg => !Array.isArray(arg) ?  arg.type !== ArgType.None : true).length;
    }

    public hasClientPermissions(guild: Guild){
        if (!this.clientPermissions){
            return true;
        }
        return guild.me.hasPermission(this.clientPermissions);
    }
}


