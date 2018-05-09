import nuke from "../../commands/utility/Nuke";
import * as Discord from "discord.js";
import * as dbg from "debug";
import {Database} from "../../database/Database";
import setWelcome from "../../commands/config/setWelcomeChannel";
import setPrefix from "../../commands/config/SetPrefix";
import systemsEval from "../../commands/debug/Eval";
import manualRestockUsers from "../../actions/ManualRestockUsers";
import getPfp, {default as pfp} from "../../commands/info/GetPfp";

import uptime from "../../commands/info/Uptime";
import source from "../../commands/info/Source";
import ch from "../../commands/fun/CyanideAndHappiness";
import {getHelp} from "../../commands/info/help/Help";
import serverInfo from "../../commands/info/ServerInfo";
import echo from "../../commands/utility/Echo";
import gb, {Instance} from "../../misc/Globals";
import admin from "../../decorators/onlyAdmin";
import {Cleverbot} from "../../API/Cleverbot";
import {MuteQueue} from "../../moderation/MuteQueue";
import {MessageQueue} from "../../moderation/MessageQueue";
import botOwner from "../../decorators/onlyOwner";
import mod from "../../decorators/onlyMod";
import getQueue from "../../commands/debug/getQueue";
import cleanse from "../../commands/utility/Cleanse";
import bump from "../../commands/self/Bump";
import settings from "../../commands/config/settings";
import setLogsChannel from "../../commands/config/setLogsChannel";
import ignore from "../../commands/self/Ignore";
import botInfo from "../../commands/info/botInfo";
import {debug} from "../../utility/Logging";
import {Channel, GuildMember, Message, TextChannel} from "discord.js";
import createMuteRole from "../../commands/config/createMuteRole";
import muteUser from "../../commands/moderation/mute";
import commandNotFoundEmbed from "../../embeds/commands/commandNotFoundEmbed";
import setHints from "../../commands/self/hints";
import setInvites from "../../commands/config/setInvites";
import getMuted from "../../commands/moderation/getMuted";
import setNote from "../../commands/moderation/setNote";
import getHistory from "../../commands/moderation/history";
import deleteNote from "../../commands/moderation/deleteNote";
import passives from "../../commands/info/passives";
import setWarningsChannel from "../../commands/config/setWarningsChannel";
import addMacro from "../../commands/utility/addMacro";
import listMacros from "../../commands/utility/listMacros";
import deleteMacro from "../../commands/utility/deleteMacro";
import randomQuote from "../../commands/fun/randomQuote";
import setChatChannel from "../../commands/config/setChatChannel";
import {Macro} from "../../database/models/macro";
import strike from "../../commands/moderation/strike";

import {throttle} from '../../decorators/throttleCommand'
import snipe from "../../commands/moderation/Snipe";
import {ArgOptions, ArgType, expect} from "../../decorators/expect";
import { REGISTRY} from "./registry";
import argParse from "../../parsers/argParse";
import {setName} from "../../commands/self/ChangeName";
import setPfp from "../../commands/self/ChangePicture";
import reactions from "../../commands/config/reactions";
import ignoredUsers from "../../commands/moderation/ignoredUsers";
import warn from "../../commands/moderation/warn";
import {LogManager} from "../logging/logManager";
import deleteStrike from "../../commands/moderation/deleteStrike";
import setGreeting from "../../commands/config/setGreeting";
import safeDeleteMessage from "../safe/SafeDeleteMessage";
import listGuilds from "../../commands/debug/listGuilds";
import EmbedBuilder from "../internal/embedBuilder";
import iHateYou from "../../commands/info/iHateYou";
import doggo from "../../commands/fun/doggo";
import suggest from "../../commands/suggestions/suggest";
import setSuggestionsChannel from "../../commands/config/setSuggestionsChannel";
import getSuggestions from "../../commands/suggestions/getSuggestions";
import approveSuggestion from "../../commands/suggestions/approveSuggestion";
import {Command} from "../../commands/info/help/help.interface";
import respondToSuggestion, {SuggestionResponse} from "../../commands/suggestions/respondToSuggestion";
import denySuggestion from "../../commands/suggestions/denySuggestion";
import removeWelcome from "../../commands/config/settings/removeWelcome";
import removeLogs from "../../commands/config/settings/removeLogs";
import removeWarnings from "../../commands/config/settings/removeWarnings";
import invite from "../../commands/self/invite";
import log from "../../commands/config/settings/log";
import ping from "../../commands/info/ping";

export interface CommandParameters extends Instance {
    message: Discord.Message;
    bot: Discord.Client;
    alexa: Cleverbot;
    muteQueue: MuteQueue;
    messageQueue: MessageQueue;
    database : Database;
    args: string[];
    input: any[];
    expect: ArgOptions[];
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
    restarting: boolean = false;
    constructor(){
        this.commands = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(method=> {
            return method !== 'constructor'
                && method !== 'handler'
                && method !== 'parseInput'
                && method !== 'restarting'
                && method !== 'getListOfAttributeDecorators'
                && method !== '_run';
        });
    }

    private getListOfAttributeDecorators(property: string): ArgOptions[] {
        const name = this.constructor.name;
        return !REGISTRY.has(name) ? [] : REGISTRY.get(name)!.get(property)!;
    }

    public static async parseInput(message : Discord.Message): Promise<UserInputData | undefined> {
        let args : string[] = [];
        const prefix = await gb.instance.database.getPrefix(message.guild.id);
        // removing excess whitespace between words that can't be removed with .trim()
        const messageContent = message.content.replace(/\s+/g, ' ').trim();
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
            debug.error(`A non text channel command was forwarded to CommandHandler`, 'CommandHandler');

        const params = <CommandParameters> gb.instance;
        params.args = inputData.args;
        params.message = message;
        params.input = [];

        for (let i in this.commands) {
            const match = this.commands[i].toLowerCase() === inputData.command.toLowerCase() ? inputData.command : undefined;
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
        const macros: Macro[] = await gb.instance.database.getMacros(message.guild.id);
        let targetMacro: Macro | undefined;
        if (macros.length){
            targetMacro = macros.find(macro => macro.macro_name === inputData.command);
            if (targetMacro){
                gb.instance.database.incrementMacroCalls(message.guild.id, message.author.id);
                return void message.channel.send(targetMacro.macro_content);
            }
        }

        // User input is not a command OR a macro, checking if guild has hints enabled
        const hints = await gb.instance.database.getCommandHints(message.guild.id);
        if (hints){
            message.channel.send(
                await commandNotFoundEmbed(message.channel, inputData.command, macros.map(macro => macro.macro_name))
            ).then((m: Message|Message[]) =>  (<Message> m).delete(30000));
        }
    }

    private async _run(message: Message, command: string, params: CommandParameters){
        params.expect = this.getListOfAttributeDecorators(command);
        params.name = command;
        try {
            const legal = await argParse(params);
            if (!legal)
                return;
            this[command](params);
            gb.instance.database.incrementCommandCalls(message.guild.id, message.author.id);
        }
        catch (error) {
            debug.error(`Unexpected error while executing ${command}\n` + error.stack)
        }

    }

    /* Owner Commands */
    @botOwner
    @expect(ArgType.Message)
    private setName(params: CommandParameters){
        setName(params.message, <[string]> params.input);
    }

    @botOwner
    @expect(ArgType.String)
    private setpfp(params: CommandParameters){
        setPfp(params.message, <[string]> params.input);
    }

    @botOwner
    @expect(ArgType.Message)
    private eval(params: CommandParameters){
        systemsEval(params, <[string]> params.input)
    }

    @botOwner
    @expect(ArgType.None)
    private guilds(params: CommandParameters){
        listGuilds(params.message);
    }

    /* Admin Commands */

    @admin
    @throttle(30)
    @expect(ArgType.String, {maxLength: 1})
    private setPrefix(params: CommandParameters){
        setPrefix(params.message, <[string]> params.input);
    }

    @admin
    @expect(ArgType.Message, {raw: true})
    private setGreeting(params: CommandParameters){
        setGreeting(params.message, <[string[]]> params.input);
    }

    @admin
    @expect(ArgType.Boolean)
    private reactions(params: CommandParameters){
        reactions(params.message, <[boolean]> params.input);
    }

    @admin
    private setup(params: CommandParameters){
        createMuteRole(params.message);
    }

    @admin
    @expect(ArgType.Boolean)
    private inviteFilter(params: CommandParameters){
        setInvites(params.message, <[boolean]> params.input);
    }

    @admin
    @expect(ArgType.Number)
    private deleteStrike(params: CommandParameters){
        deleteStrike(params.message, <[number]> params.input);
    }

    @admin
    @expect(ArgType.None)
    private setWelcome(params : CommandParameters){
        setWelcome(params.message);
    }

    @admin
    @expect(ArgType.None)
    private removeWelcome(params : CommandParameters){
        removeWelcome(params.message);
    }

    @admin
    @throttle(10)
    @expect(ArgType.None)
    private setLogs(params : CommandParameters){
        setLogsChannel(params.message);
    }

    @admin
    @expect(ArgType.None)
    private removeLogs(params : CommandParameters){
        removeLogs(params.message);
    }

    @admin
    @expect(ArgType.None)
    private setWarnings(params: CommandParameters){
        setWarningsChannel(params.message);
    }

    @admin
    @expect(ArgType.None)
    private removeWarnings(params : CommandParameters){
        removeWarnings(params.message);
    }

    @admin
    @expect(ArgType.None)
    private setChat(params: CommandParameters){
        setChatChannel(params.message);
    }

    // @admin
    // @expect(ArgType.String)
    // private setMute(params: CommandParameters){
    //     //setMuteRole()
    // }

    @admin
    @expect(ArgType.String, {maxLength: 15})
    @expect([ArgType.Boolean, ArgType.Channel])
    private log(params: CommandParameters){
        log(params.message, <[string, (TextChannel | string)]> params.input)
    }

    @admin
    @expect(ArgType.String, {maxLength: 15})
    @expect([ArgType.Boolean, ArgType.Channel])
    private logs(params: CommandParameters){
        log(params.message, <[string, (TextChannel | string)]> params.input)
    }

    @mod
    @expect(ArgType.String, {optional: true})
    @expect(ArgType.String, {optional: true})
    private settings(params : CommandParameters){
        settings(params.message, <[string, string]> params.input);
    }

    /* Mod Commands */

    @mod
    @throttle(10)
    @expect(ArgType.Member)
    private ignore(params : CommandParameters){
        ignore(params.message, <[GuildMember]> params.input);
    }

    @mod
    @throttle(15)
    @expect(ArgType.Number, {maxRange: 500, optional: true})
    private nuke(params: CommandParameters){
        nuke(params.message, <[number] | undefined > params.input);
    }

    @mod
    @throttle(15)
    @expect(ArgType.Number, {maxRange: 500, optional: true})
    private cleanse(params: CommandParameters){
        cleanse(params.message.channel, <[number] | undefined> params.input)
    }

    @mod
    @expect(ArgType.Member)
    @expect(ArgType.Number, {maxRange: 60 * 24})
    @expect(ArgType.Message)
    private mute(params: CommandParameters){
        muteUser(params.message, <[GuildMember, number, string]> params.input);
    }

    @mod
    @throttle(10)
    @expect(ArgType.String, {maxLength: 2})
    @expect(ArgType.Message)
    private addMacro(params: CommandParameters){
        addMacro(params.message, <[string, string]> params.input);
    }

    @mod
    @expect(ArgType.String)
    private deleteMacro(params: CommandParameters){
        deleteMacro(params.message, <[string]> params.input);
    }

    @mod
    @expect(ArgType.Channel, {channelType: TextChannel})
    @expect(ArgType.Message)
    private echo(params : CommandParameters){
        echo(params.message, <[TextChannel, string]> params.input)
    }

    @mod
    @expect(ArgType.Boolean)
    private hints(params: CommandParameters){
        setHints(params.message, <[boolean]> params.input);
    }

    @mod
    @throttle(10)
    @expect(ArgType.Member)
    @expect(ArgType.Message)
    private note(params: CommandParameters){
        setNote(params.message, <[GuildMember, string]> params.input);
    }

    @mod
    @throttle(10)
    @expect(ArgType.Number)
    private deleteNote(params: CommandParameters){
        deleteNote(params.message, <[number]> params.input);
    }

    @mod
    @expect(ArgType.Member)
    private history(params: CommandParameters){
        getHistory(params.message, <[GuildMember]> params.input);
    }

    @mod
    @throttle(15)
    @expect(ArgType.Member)
    @expect(ArgType.Number)
    @expect(ArgType.Message, {minWords: 2})
    private strike(params: CommandParameters){
        strike(params.message, <[GuildMember, number, string]> params.input);
    }

    @mod
    @throttle(15)
    @expect(ArgType.Member)
    @expect(ArgType.Message, {minWords: 2})
    private warn(params: CommandParameters){
        warn(params.message, <[GuildMember, string]> params.input)
    }

    @mod
    @throttle(30)
    @expect(ArgType.Member)
    @expect(ArgType.Number, {optional: true, minRange: 5, maxRange: 500})
    private snipe(params: CommandParameters){
        snipe(params.message, <[GuildMember, number]> params.input);
    }

    @mod
    @expect(ArgType.None)
    private ignoredUsers(params: CommandParameters){
        ignoredUsers(params.message);
    }

    @mod
    @expect(ArgType.None)
    private suggestions(params: CommandParameters){
        getSuggestions(params.message);
    }

    @mod
    @expect(ArgType.Number)
    @expect(ArgType.Message)
    private accept(params: CommandParameters){
        respondToSuggestion(params.message, <[string, string]> params.input, SuggestionResponse.ACCEPTED);
    }

    @mod
    @expect(ArgType.Number)
    @expect(ArgType.Message)
    private reject(params: CommandParameters){
        respondToSuggestion(params.message, <[string, string]> params.input, SuggestionResponse.REJECTED);
    }

    /* Public Commands */
    @expect(ArgType.Message)
    private embed(params: CommandParameters){
        EmbedBuilder.getInstance().embed(params.message, <[string]> params.input)
    }

    @expect(ArgType.Message)
    private editEmbed(params: CommandParameters){
        EmbedBuilder.getInstance().editEmbed(params.message);
    }

    @expect(ArgType.None)
    private sendEmbed(params: CommandParameters){
        EmbedBuilder.getInstance().sendEmbed(params.message);
    }

    @expect(ArgType.Message, {optional: true})
    private help(params: CommandParameters){
        getHelp(params.message, <[string] | undefined > params.input)
    }

    @expect(ArgType.None)
    private passives(params: CommandParameters){
        passives(params.message);
    }

    @throttle(10)
    @expect(ArgType.Member)
    private pfp(params : CommandParameters){
        pfp(params.message, <[GuildMember]> params.input);
    }

    @throttle(10)
    @expect(ArgType.None)
    private uptime(params : CommandParameters){
        uptime(params.message);
    }

    @expect(ArgType.String, {optional: true})
    private source(params: CommandParameters){
        source(params.message, <[string] | undefined> params.input);
    }

    @throttle(5)
    @expect(ArgType.None)
    private ch(params: CommandParameters){
        ch(params.message);
    }

    @throttle(20)
    @expect(ArgType.None)
    private serverInfo(params: CommandParameters){
        serverInfo(params.message);
    }

    @throttle(20)
    @expect(ArgType.None)
    private botInfo(params: CommandParameters){
        botInfo(params.message);
    }

    @expect(ArgType.None)
    private macros(params: CommandParameters){
        listMacros(params.message)
    }

    @throttle(20)
    @expect(ArgType.None)
    private bump(params : CommandParameters){
        bump(params.message);
    }

    @throttle(10)
    @expect(ArgType.None)
    private randomQuote(params: CommandParameters){
        randomQuote(params.message);
    }

    @expect(ArgType.None)
    private doggo(params: CommandParameters){
        doggo(params.message);
    }

    @expect(ArgType.None)
    private iHateYou(params: CommandParameters){
        iHateYou(params.message);
    }

    @throttle(10)
    @expect(ArgType.Message)
    private suggest(params: CommandParameters){
        suggest(params.message, <[string]> params.input);
    }

    @expect(ArgType.None)
    private setSuggestions(params: CommandParameters){
        setSuggestionsChannel(params.message);
    }

    @expect(ArgType.None)
    private invite(params: CommandParameters){
        invite(params.message);
    }

    @expect(ArgType.None)
    private ping(params: CommandParameters){
        ping(params.message);
    }
}
