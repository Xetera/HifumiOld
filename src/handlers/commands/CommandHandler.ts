import * as Discord from "discord.js";
import {Database} from "../../database/Database";
import setPrefix from "../../commands/config/SetPrefix";
import gb, {Instance} from "../../misc/Globals";
import admin from "../../decorators/onlyAdmin";
import {Cleverbot} from "../../API/Cleverbot";
import {MuteQueue} from "../../moderation/MuteQueue";
import {MessageQueue} from "../../moderation/MessageQueue";
import botOwner from "../../decorators/onlyOwner";
import mod from "../../decorators/onlyMod";
import cleanse from "../../commands/utility/Cleanse";
import settings from "../../commands/config/settings";
import commandNotFoundEmbed from "../../embeds/commands/commandNotFoundEmbed";
import setInvites from "../../commands/config/_setInvites";
import randomQuote from "../../commands/fun/randomQuote";
import {Macro} from "../../database/models/macro";
import {requires} from "../../decorators/requires";
import {throttle} from '../../decorators/throttleCommand'
import {ArgOptions, ArgType} from "../../decorators/expects";
import argParse from "../../parsers/argParse";
import {LogManager} from "../logging/logManager";
import safeDeleteMessage from "../safe/SafeDeleteMessage";
import EmbedBuilder from "../internal/embedBuilder";
import removeWelcome from "../../commands/config/settings/removeWelcome";
import removeLogs from "../../commands/config/settings/removeLogs";
import removeWarnings from "../../commands/config/settings/removeWarnings";
import {expects} from "../../decorators/expects";
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



export interface CommandParameters extends Instance {
    message: Discord.Message;
    bot: Discord.Client;
    alexa: Cleverbot;
    muteQueue: MuteQueue;
    messageQueue: MessageQueue;
    database : Database;
    args: string[];
    input: any[];
    expect: (ArgOptions | ArgOptions[])[];
    name: string;
}

interface indexSignature {
    [method:string]: (CommandParameters);
}

interface UserInputData {
    stealth: boolean;
    command: string;
    args: string[];
}


function isMessage(message : any) : message is Discord.Message {
    return <Discord.Message> message.content !== undefined;
}

export default class CommandHandler implements indexSignature {
    [method:string]: any;
    commands : string[];
    _newCommands: Command[] = [];
    restarting: boolean = false;
    constructor(){
        this.glob();
    }

    public glob(){
        glob(__dirname + '/../../commands/**/*.js', {absolute: false}, ((err, matches) => {
            if (err){
                return void console.error(err);
            }
            for (let fileName of matches){
                const file = require(fileName);
                if (file.command){
                    this._newCommands.push(<Command> file.command);
                }
            }
        }));
    }

    public static async parseInput(message : Discord.Message): Promise<UserInputData | undefined> {
        let args : string[] = [];
        const prefix = await gb.instance.database.getPrefix(message.guild.id);
        // removing excess whitespace between words that can't be removed with .trim()
        const messageContent = message.content.replace(/ +/g, ' ').trim();
        if (isMessage(message))
            args = messageContent.split(' ');
        else
            throw new TypeError(`'${message}' is not a Message object.`);

        let input : string | undefined = args.shift()!;

        // detecting stealth command
        // setting the rest of the properties later
        let out = <UserInputData> {
            args: args
        };

        if (input === prefix || input === prefix + prefix){
            return;
        }

        else if (input.substring(0, 2) === prefix + prefix){
            debug.silly(`[${message.guild.name}]<${message.author}> Entered a stealth command`, 'CommandHandler');
            out.stealth = true;
            out.command = input.substring(2);
            return out;
        }
        else if (input[0] === prefix){
            out.stealth = false;
            out.command=input.substring(1);
            return out;
        }

        // not a command
        return;
    }

    public async handler(message : Message) {
        if (this.restarting)
            return;
        const inputData: UserInputData | undefined = await CommandHandler.parseInput(message);
        if (inputData === undefined)
            return;
        else if (inputData.stealth){
            safeDeleteMessage(message);
        }

        if (message.channel instanceof TextChannel)
            debug.info(`[${message.guild.name}]::${message.channel.name}::<${message.author.username}>: ${message.content}`, 'CommandHandler');
        else
            return debug.error(`A non text channel command was forwarded to CommandHandler`, 'CommandHandler');

        const params = <CommandParameters> gb.instance;
        params.args = inputData.args;
        params.message = message;
        params.input = [];

        for (let i in this._newCommands) {
            const match = this._newCommands[i].names.find(name => name.toLowerCase()  ===inputData.command.toLowerCase());
            if (!match)
                continue;
            const execution = this._newCommands[i];

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
        const macros: Macro[] = await gb.instance.database.getMacros(message.guild.id);
        let targetMacro: Macro | undefined;
        if (macros.length){
            targetMacro = macros.find(macro => macro.macro_name === inputData.command);
            if (targetMacro) {
                gb.instance.database.incrementMacroCalls(message.guild.id, message.author.id);
                const content = await buildMacro(targetMacro);
                const isPureMessage = typeof content[0] !== 'object' && (!content[1] || typeof content[1] !== 'object');
                if (isPureMessage){
                    try {
                        return message.channel.send(content);
                    } catch (err){
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
        const hints = await gb.instance.database.getCommandHints(message.guild.id);
        if (hints){
            safeSendMessage( message.channel,
                await commandNotFoundEmbed(message.channel, inputData.command, macros.map(macro => macro.macro_name)),
            30);
        }
        message.channel.stopTyping();
    }

    private async _run(message: Message, command: Command, params: CommandParameters){
        params.expect = command.expects;
        const [name] = command.names;
        params.name = name;
        try {
            if (CommandHandler.checkBrokenFunction(command)){
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
            if(missingC.length){
               return safeSendMessage(message.channel, await missingSelfPermission(message.guild, missingC));
            }

            const missingP = CommandHandler.getMissingUserPermission(message.member, command);

            if (missingP === UserPermissions.Administrator && !message.member.hasPermission('ADMINISTRATOR')){
                return safeSendMessage(message.channel, await missingAdminEmbed(message.guild));
            }

            else if (missingP === UserPermissions.Moderator && !message.member.hasPermission('BAN_MEMBERS')){
                return safeSendMessage(message.channel, await missingModEmbed(message.guild));
            }
            else if (missingP === UserPermissions.GuildOwner && message.member.id !== message.member.guild.ownerID){
                return safeSendMessage(message.channel, missingGuildOwnerEmbed(message.guild));
            }

            const legal = await argParse(params);
            if (!legal)
                return;

            command.run(params.message, <any> params.input);
            gb.instance.database.incrementCommandCalls(message.guild.id, message.author.id);
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
    private static checkBrokenFunction(command: Command){
        return command.argLength < command.run.length - 1;
    }

    private static getMissingClientPermissions(executor: GuildMember, command: Command): PermissionResolvable[] {
        const clientPerms = command.clientPermissions;
        // no permissions of any kind required
        if ((!clientPerms || !clientPerms.length || executor.guild.me.hasPermission('ADMINISTRATOR'))){
            return [];
        }
        if (clientPerms && clientPerms.length){
            const missing = executor.guild.me.missingPermissions(clientPerms);
            if (missing.length){
                return missing
            }
        }
        return [];
    }

    public static getMissingUserPermission(executor: GuildMember, command: Command): UserPermissions | false {
        // !command.userPermissions also catches UserPermissions === 0
        // by default since it's an enum
        if (!command.userPermissions && command.userPermissions !== ''){
            return false;
        }
        if (command.userPermissions === UserPermissions.Administrator && !executor.hasPermission('ADMINISTRATOR')){
            return UserPermissions.Administrator;
        }
        else if (command.userPermissions === UserPermissions.Moderator && !executor.hasPermission('BAN_MEMBERS')){
            return UserPermissions.Moderator;
        }
        else if (command.userPermissions === UserPermissions.GuildOwner && executor.id !== executor.guild.ownerID){
            return UserPermissions.GuildOwner
        }
        else {
            return false;
        }
    }

    public findCommand(targetName: string, excludeOwner: boolean = false){
        for (let command of this._newCommands){
            // Could be shorter, but this is easier to read
            if (excludeOwner && command.userPermissions === UserPermissions.BotOwner){
                continue;
            }
            if (command.names.includes(targetName)){
                return command;
            }
        }
    }

    /* Admin Commands */

    @admin
    @throttle(30)
    @expects(ArgType.String, {maxLength: 1})
    private setPrefix(params: CommandParameters){
        setPrefix(params.message, <[string]> params.input);
    }

    @admin
    @requires('MANAGE_MESSAGES')
    @expects(ArgType.Boolean)
    private inviteFilter(params: CommandParameters){
        setInvites(params.message, <[boolean]> params.input);
    }

    @admin
    @expects(ArgType.None)
    private removeWelcome(params : CommandParameters){
        removeWelcome(params.message);
    }

    @admin
    @expects(ArgType.None)
    private removeLogs(params : CommandParameters){
        removeLogs(params.message);
    }

    @admin
    @expects(ArgType.None)
    private removeWarnings(params : CommandParameters){
        removeWarnings(params.message);
    }

    @mod
    @expects(ArgType.String, {optional: true})
    @expects(ArgType.String, {optional: true})
    private settings(params : CommandParameters){
        settings(params.message, <[string, string]> params.input);
    }

    /* Mod Commands */

    @mod
    @throttle(15)
    @requires('MANAGE_MESSAGES')
    @expects(ArgType.Number, {maxRange: 500, optional: true})
    private cleanse(params: CommandParameters){
        cleanse(params.message.channel, <[number] | undefined> params.input)
    }

    /* Public Commands */
    @expects(ArgType.Message)
    private embed(params: CommandParameters){
        EmbedBuilder.getInstance().embed(params.message, <[string]> params.input)
    }

    @expects(ArgType.Message)
    private editEmbed(params: CommandParameters){
        EmbedBuilder.getInstance().editEmbed(params.message);
    }

    @expects(ArgType.None)
    private sendEmbed(params: CommandParameters){
        EmbedBuilder.getInstance().getEmbed(params.message);
    }

    @expects(ArgType.None)
    private randomQuote(params: CommandParameters){
        randomQuote(params.message);
    }

}
