import * as Discord from "discord.js";
import {Database} from "../../database/Database";
import {gb, Instance} from "../../misc/Globals";
import {Cleverbot} from "../../API/Cleverbot";
import {MuteQueue} from "../../moderation/MuteQueue";
import {MessageQueue} from "../../moderation/MessageQueue";
import commandNotFoundEmbed from "../../embeds/commands/commandNotFoundEmbed";
import {Macro} from "../../database/models/macro";
import {ArgOptions} from "../../decorators/expects";
import argParse from "../../parsers/argParse";
import {LogManager} from "../logging/logManager";
import safeDeleteMessage from "../safe/SafeDeleteMessage";
import {buildMacro} from "../../parsers/parseMacro";
import {Command} from "./Command";
import glob = require('glob')
import {UserPermissions} from "./command.interface";
import safeSendMessage from "../safe/SafeSendMessage";
import missingAdminEmbed from "../../embeds/permissions/missingAdminEmbed";
import missingModEmbed from "../../embeds/permissions/missingModEmbed";
import missingGuildOwnerEmbed from "../../embeds/permissions/missingGuildOwnerEmbed";
import missingSelfPermission from "../../embeds/permissions/missingSelfPermission";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {debug} from "../../utility/Logging";
import {GuildMember, Message, PermissionResolvable, TextChannel} from "discord.js";
import {Environments} from "../../events/systemStartup";
import {handleFatalErrorGracefully} from "../process/fatal";

export interface CommandParameters extends Instance {
    message: Discord.Message;
    bot: Discord.Client;
    hifumi: Cleverbot;
    muteQueue: MuteQueue;
    messageQueue: MessageQueue;
    database: Database;
    args: string[];
    input: any[];
    expect: (ArgOptions | ArgOptions[])[];
    name: string;
}

interface indexSignature {
    [method: string]: (CommandParameters);
}

interface UserInputData {
    stealth: boolean;
    command: string;
    args: string[];
}

function isMessage(message: any): message is Discord.Message {
    return <Discord.Message> message.content !== undefined;
}

export default class CommandHandler implements indexSignature {
    [method: string]: any;

    commands: Command[] = [];
    restarting: boolean = false;

    constructor() {
        this.glob();
    }

    private isCommandMissingDependency(command: Command): string | false {
        const reqEnv = command.dependsOn;
        if (!reqEnv) {
            return false;
        }
        if (Array.isArray(reqEnv)) {
            for (const env of reqEnv) {
                if (!process.env[env]) {
                    return env;
                }
            }
        }
        else if (!process.env[reqEnv]) {
            return reqEnv;
        }
        return false;
    }

    public glob() {
        glob(__dirname + '/../../commands/**/*.js', {absolute: false}, ((err, matches) => {
            if (err) {
                return void console.error(err);
            }
            for (let fileName of matches) {
                const file = require(fileName);
                if (!file.command) {
                    continue;
                }
                const command: Command = file.command;
                const missing = this.isCommandMissingDependency(file.command);
                if (missing && gb.ENV === Environments.Development) {
                    debug.warning(
                        `The command $${command.names[0]} will not be loaded because the ` +
                        `environment variable '${missing}' is missing.`
                    );
                    continue;
                } else if (missing && gb.ENV === Environments.Production) {
                    return handleFatalErrorGracefully(new Error(
                        `The command $${command.names[0]} is missing the required env variable '${missing}' ` +
                        `in production mode!`
                    ));
                }
                this.commands.push(command);
            }
        }));
    }

    public static async parseInput(message: Discord.Message): Promise<UserInputData | undefined> {
        let args: string[] = [];
        const prefix = await gb.database.getPrefix(message.guild.id);
        // removing excess whitespace between words that can't be removed with .trim()
        const messageContent = message.content.replace(/ +/g, ' ').trim();
        if (isMessage(message))
            args = messageContent.split(' ');
        else
            throw new TypeError(`'${message}' is not a Message object.`);

        let input: string | undefined = args.shift()!;

        // detecting stealth command
        // setting the rest of the properties later
        let out = <UserInputData> {
            args: args
        };

        if (input === prefix || input === prefix + prefix) {
            return;
        }

        else if (input.substring(0, 2) === prefix + prefix) {
            debug.silly(`[${message.guild.name}]<${message.author}> Entered a stealth command`);
            out.stealth = true;
            out.command = input.substring(2);
            return out;
        }
        else if (input[0] === prefix) {
            out.stealth = false;
            out.command = input.substring(1);
            return out;
        }

        // not a command
        return;
    }

    public async handler(message: Message) {
        if (this.restarting)
            return;
        const inputData: UserInputData | undefined = await CommandHandler.parseInput(message);
        if (inputData === undefined)
            return;
        else if (inputData.stealth) {
            safeDeleteMessage(message);
        }

        if (message.channel instanceof TextChannel)
            debug.info(`[${message.guild.name}]::${message.channel.name}::<${message.author.username}>: ${message.content}`);
        else
            return void debug.error(`A non text channel command was forwarded to CommandHandler`);

        const params = <CommandParameters> {};
        params.args = inputData.args;
        params.message = message;
        params.input = [];

        for (let i in this.commands) {
            const match = this.commands[i].names.find(name => name.toLowerCase() === inputData.command.toLowerCase());
            if (!match)
                continue;
            const execution = this.commands[i];

            try {
                this._run(message, execution, params);
            }
            catch (error) {
                debug.error(`Unexpected error while executing ${inputData.command}\n` + error.stack)
            }
            if (inputData.stealth) {
                LogManager.logCommandExecution(message, params.name);
            }
            return;
        }

        // User input is not a command, checking macros
        const macros: Macro[] = await gb.database.getMacros(message.guild.id);
        let targetMacro: Macro | undefined;
        if (macros.length) {
            targetMacro = macros.find(macro => macro.macro_name === inputData.command);
            if (targetMacro) {
                gb.database.incrementMacroCalls(message.guild.id, message.author.id);
                const content = await buildMacro(targetMacro);
                const isPureMessage = typeof content[0] !== 'object' && (!content[1] || typeof content[1] !== 'object');
                if (isPureMessage) {
                    try {
                        return message.channel.send(content);
                    } catch (err) {
                        return handleFailedCommand(message.channel,
                            `There was a problem sending that macro, this an error`
                        )
                    }
                }
                await message.channel.startTyping();
                message.channel.send(...content).catch(debug.error);
                return await message.channel.stopTyping();
            }
        }

        // User input is not a command OR a macro, checking if guild has hints enabled
        const hints = await gb.database.getCommandHints(message.guild.id);
        if (hints) {
            safeSendMessage(message.channel,
                await commandNotFoundEmbed(message.channel, inputData.command, macros.map(macro => macro.macro_name)),
                30);
        }
        message.channel.stopTyping();
    }

    private async _run(message: Message, command: Command, params: CommandParameters) {
        params.expect = command.expects;
        const [name] = command.names;
        params.name = name;
        try {
            if (CommandHandler.checkBrokenFunction(command)) {
                return void handleFailedCommand(
                    message.channel,
                    "**Ding!** You've just been struck by the magic of spaghetti code!\n" +
                    "The person who made me forgot to change the type declaration for the arguments the command " +
                    "accepts to reflect what the run function actually expects. This shouldn't ever happen unless " +
                    "you're severely lacking in the IQ department. Go make him feel bad in the support server.",
                    "But seriously... If you're seeing this please tell me, it's a bug."
                )
            }
            // checking permissions first
            const missingC = CommandHandler.getMissingClientPermissions(message.member, command);
            if (missingC.length) {
                return safeSendMessage(message.channel, await missingSelfPermission(message.guild, missingC));
            }

            const missingP = CommandHandler.getMissingUserPermission(message.member, command);

            if (missingP === UserPermissions.Administrator && !message.member.hasPermission('ADMINISTRATOR')) {
                return safeSendMessage(message.channel, await missingAdminEmbed(message.guild));
            }

            else if (missingP === UserPermissions.Moderator && !message.member.hasPermission('BAN_MEMBERS')) {
                return safeSendMessage(message.channel, await missingModEmbed(message.guild));
            }
            else if (missingP === UserPermissions.GuildOwner && message.member.id !== message.member.guild.ownerID) {
                return safeSendMessage(message.channel, missingGuildOwnerEmbed(message.guild));
            }

            const legal = await argParse(params);
            if (!legal)
                return;

            command.run(params.message, <any> params.input);
            gb.database.incrementCommandCalls(message.guild.id, message.author.id);
        }
        catch (error) {
            debug.error(`Unexpected error while executing ${command}\n` + error.stack)
        }
    }

    /**
     * This is supposed to check to see if I was a dumbass and forgot to set the expect parameters but because
     * our input parameter is a tuple we can't just compare the length of one's parameter to another we can only
     * check to see if I forgot to change the default :expects parameter from None to something else, that's about it
     */
    private static checkBrokenFunction(command: Command) {
        return command.argLength < command.run.length - 1;
    }

    private static getMissingClientPermissions(executor: GuildMember, command: Command): PermissionResolvable[] {
        const clientPerms = command.clientPermissions;
        // no permissions of any kind required
        if ((!clientPerms || !clientPerms.length || executor.guild.me.hasPermission('ADMINISTRATOR'))) {
            return [];
        }
        if (clientPerms && clientPerms.length) {
            const missing = executor.guild.me.missingPermissions(clientPerms);
            if (missing.length) {
                return missing
            }
        }
        return [];
    }

    public static getMissingUserPermission(executor: GuildMember, command: Command): UserPermissions | false {
        // !command.userPermissions also catches UserPermissions === 0
        // by default since it's an enum
        if (executor.id === gb.ownerID) {
            return false;
        }
        else if (!command.userPermissions && command.userPermissions !== '') {
            return false;
        }
        else if (command.userPermissions === UserPermissions.Administrator && !executor.hasPermission('ADMINISTRATOR')) {
            return UserPermissions.Administrator;
        }
        else if (command.userPermissions === UserPermissions.Moderator && !executor.hasPermission('BAN_MEMBERS')) {
            return UserPermissions.Moderator;
        }
        else if (command.userPermissions === UserPermissions.GuildOwner && executor.id !== executor.guild.ownerID) {
            return UserPermissions.GuildOwner
        }
        else {
            return false;
        }
    }

    public findCommand(targetName: string, excludeOwner: boolean = false) {
        for (let command of this.commands) {
            // Could be shorter, but this is easier to read
            if (excludeOwner && command.userPermissions === UserPermissions.BotOwner) {
                continue;
            }
            if (command.names.includes(targetName)) {
                return command;
            }
        }
    }
}
