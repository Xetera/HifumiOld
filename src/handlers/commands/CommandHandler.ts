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
import {Instance} from "../../misc/Globals";
import onlyAdmin from "../permissions/decorators/onlyAdmin";
import {Alexa} from "../../API/Alexa";
import {MuteQueue} from "../../moderation/MuteQueue";
import {MessageQueue} from "../../moderation/MessageQueue";
import onlyOwner from "../permissions/decorators/onlyOwner";
import setName from "../../commands/self/ChangeName";
import setAvatar from "../../commands/self/ChangePicture";
import onlyMod from "../permissions/decorators/onlyMod";
import getQueue from "../../commands/debug/getQueue";
import cleanse from "../../commands/utility/Cleanse";
import bump from "../../commands/self/Bump";
import getConfig from "../../commands/config/getConfig";
import setLogsChannel from "../../commands/config/setLogsChannel";
import getCache from "../../commands/debug/Cache";
import ignore from "../../commands/self/Ignore";
import botInfo from "../../commands/info/botInfo";
import {debug} from "../../utility/Logging";
import {Channel, GuildMember, Message, Permissions, TextChannel} from "discord.js";
import createMuteRole from "../../commands/config/createMuteRole";
import muteUser from "../../commands/moderation/mute";
import setupMutePermissions from "../../commands/config/setupMutePermissions";
import commandNotFoundEmbed from "../../embeds/commands/commandNotFoundEmbed";
import setHints from "../../commands/self/hints";
import setInvites from "../../commands/config/setInvites";
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
import {ArgOptions, ArgType, expects} from "../../decorators/expects";
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
import Anime from "../../API/anime";
import daily from "../../commands/economy/daily";
import balance from "../../commands/economy/balance";
import {requires} from "../../decorators/requires";

export interface CommandParameters extends Instance {
    message: Discord.Message;
    args: string[];
    bot: Discord.Client;
    alexa: Alexa,
    muteQueue: MuteQueue,
    messageQueue: MessageQueue,
    database : Database
}

interface indexSignature {
    [method:string]: (CommandParameters);
}


function isMessage(message : any) : message is Discord.Message {
    return <Discord.Message> message.content !== undefined;
}

export default class CommandHandler implements indexSignature {
    [method:string]: any;
    commands : string[];

    constructor(){
        this.commands = (Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(method=>{
            return method !== 'constructor' && method !== 'handler' && method !== 'parseInput';
        }));
    }

    public static parseInput(message : Discord.Message) : [string, string[]]{
        let args : string[] = [];
        // removing excess whitespace between words that can't be removed with .trim()
        const messageContent = message.content.replace(/\s+/, ' ');
        if (isMessage(message))
            args = messageContent.split(' ');
        else
            throw new TypeError(`'${message}' is not a Message object.`);

        let command : string | undefined = args.shift();
        if (command !== undefined) {
            command = command.substring(1);
            return [command, args];
        }
        else {
            return ['', ['']]
        }
    }

    public handler(message : Discord.Message,instance : Instance) {
        const [command, args] = CommandHandler.parseInput(message);
        if (command == '') return;

        if (message.channel instanceof TextChannel)
            debug.info(`[${message.guild.name}]::${message.channel.name}::<${message.author.username}>: ${message.content}`, 'CommandHandler');
        else
            debug.error(`A non text channel command was forwarded to CommandHandler`, 'CommandHandler');

        const params = <CommandParameters> instance;
        params.args = args;
        params.message = message;

        for (let i in this.commands) {
            const match = this.commands[i].toLowerCase() === command.toLowerCase() ? command : undefined;
            if (!match)
                continue;
            const execution = this.commands[i];
            try {
                return this[execution](params);
            }
            catch (error) {
                debug.error(`Unexpected error while executing ${command}\n` + error.stack)
            }
        }
        if (command === null)
            return;
        const hints = instance.database.getCommandHints(message.guild);
        if (hints){
            message.channel.send(
                commandNotFoundEmbed(message.channel, command)
            );
        }
    }

    @onlyOwner
    private setName(params: CommandParameters){
        const name = params.args.join(' ');
        setName(params.message, name);
    }
    /* Owner Commands */
    @botOwner
    @expects(ArgType.Message)
    private setName(params: CommandParameters){
        setName(params.message, <[string]> params.input);
    }

    @botOwner
    @expects(ArgType.String)
    private setpfp(params: CommandParameters){
        setPfp(params.message, <[string]> params.input);
    }

    @botOwner
    @expects(ArgType.Message)
    private eval(params: CommandParameters){
        systemsEval(params, <[string]> params.input)
    }

    @botOwner
    @expects(ArgType.None)
    private guilds(params: CommandParameters){
        listGuilds(params.message);
    }

    /* Admin Commands */

    @admin
    @throttle(30)
    @expects(ArgType.String, {maxLength: 1})
    private setPrefix(params: CommandParameters){
        setPrefix(params.message, <[string]> params.input);
    }

    @admin
    @expects(ArgType.Message, {raw: true})
    private setGreeting(params: CommandParameters){
        setGreeting(params.message, <[string[]]> params.input);
    }

    @admin
    @expects(ArgType.Boolean)
    private reactions(params: CommandParameters){
        reactions(params.message, <[boolean]> params.input);
    }

    @onlyAdmin
    private setup(params: CommandParameters){
        createMuteRole(params.message);
    }

    @admin
    @expects(ArgType.Boolean)
    private inviteFilter(params: CommandParameters){
        setInvites(params.message, params.args);
    }

    @admin
    @expects(ArgType.Number)
    private deleteStrike(params: CommandParameters){
        deleteStrike(params.message, <[number]> params.input);
    }

    @admin
    @expects(ArgType.None)
    private setWelcome(params : CommandParameters){
        setWelcome(params.message);
    }

    @admin
    @expects(ArgType.None)
    private removeWelcome(params : CommandParameters){
        removeWelcome(params.message);
    }

    @admin
    @throttle(10)
    @expects(ArgType.None)
    private setLogs(params : CommandParameters){
        setLogsChannel(params.message);
    }

    @admin
    @expects(ArgType.None)
    private removeLogs(params : CommandParameters){
        removeLogs(params.message);
    }

    @admin
    @expects(ArgType.None)
    private setWarnings(params: CommandParameters){
        setWarningsChannel(params.message);
    }

    @admin
    @expects(ArgType.None)
    private removeWarnings(params : CommandParameters){
        removeWarnings(params.message);
    }

    @admin
    @expects(ArgType.None)
    private setChat(params: CommandParameters){
        setChatChannel(params.message);
    }

    @admin
    @expects(ArgType.String, {maxLength: 15})
    @expects([ArgType.Boolean, ArgType.Channel])
    private log(params: CommandParameters){
        log(params.message, <[string, (TextChannel | string)]> params.input)
    }

    @admin
    @expects(ArgType.String, {maxLength: 15})
    @expects([ArgType.Boolean, ArgType.Channel])
    private logs(params: CommandParameters){
        log(params.message, <[string, (TextChannel | string)]> params.input)
    }

    @mod
    @expects(ArgType.String, {optional: true})
    @expects(ArgType.String, {optional: true})
    private settings(params : CommandParameters){
        settings(params.message, <[string, string]> params.input);
    }

    /* Mod Commands */

    @mod
    @expects(ArgType.Member)
    private ignore(params : CommandParameters){
        const user = params.message.mentions.members.first();
        ignore(params.message, user, params.database);
    }

    @mod
    @requires('MANAGE_MESSAGES')
    @expects(ArgType.Number, {maxRange: 500, optional: true})
    private nuke(params: CommandParameters){
        nuke(params.message.channel, parseInt(params.args[0]));
    }

    @mod
    @throttle(15)
    @requires('MANAGE_MESSAGES')
    @expects(ArgType.Number, {maxRange: 500, optional: true})
    private cleanse(params: CommandParameters){
        const limit : string | undefined = params.args.shift()!;
        cleanse(params.message.channel, params.database, parseInt(limit))
    }

    @mod
    @requires('MANAGE_ROLES')
    @expects(ArgType.Member, {strict: true})
    @expects(ArgType.Number, {maxRange: 60 * 24})
    @expects(ArgType.Message)
    private mute(params: CommandParameters){
        muteUser(params.message, params.args);
    }

    @mod
    @throttle(10)
    @expects(ArgType.String, {maxLength: 2})
    @expects(ArgType.Message)
    private addMacro(params: CommandParameters){
        addMacro(params.message, <[string, string]> params.input);
    }

    @mod
    @expects(ArgType.String)
    private deleteMacro(params: CommandParameters){
        deleteMacro(params.message, <[string]> params.input);
    }

    @mod
    @expects(ArgType.Channel, {channelType: 'text'})
    @expects(ArgType.Message)
    private echo(params : CommandParameters){
        echo(params.message, params.args)
    }

    @mod
    @expects(ArgType.Boolean)
    private hints(params: CommandParameters){
        setHints(params.message, params.args);
    }

    @mod
    @expects(ArgType.Member)
    @expects(ArgType.Message)
    private note(params: CommandParameters){
        setNote(params.message, <[GuildMember, string]> params.input);
    }

    @mod
    @expects(ArgType.Number)
    private deleteNote(params: CommandParameters){
        deleteNote(params.message, <[number]> params.input);
    }

    @mod
    @expects(ArgType.Member, {strict: false})
    private history(params: CommandParameters){
        getHistory(params.message, <[GuildMember]> params.input);
    }

    @mod
    @requires('BAN_MEMBERS')
    @expects(ArgType.Member)
    @expects(ArgType.Number)
    @expects(ArgType.Message, {minWords: 2})
    private strike(params: CommandParameters){
        strike(params.message, <[GuildMember, number, string]> params.input);
    }

    @mod
    @expects(ArgType.Member)
    @expects(ArgType.Message, {minWords: 2})
    private warn(params: CommandParameters){
        warn(params.message, <[GuildMember, string]> params.input)
    }

    @mod
    @requires('MANAGE_MESSAGES')
    @expects(ArgType.Member)
    @expects(ArgType.Number, {optional: true, minRange: 5, maxRange: 500})
    private snipe(params: CommandParameters){
        snipe(params.message, <[GuildMember, number]> params.input);
    }

    @mod
    @expects(ArgType.None)
    private ignoredUsers(params: CommandParameters){
        ignoredUsers(params.message);
    }

    @mod
    @requires('MANAGE_MESSAGES')
    @expects(ArgType.None)
    private suggestions(params: CommandParameters){
        getSuggestions(params.message);
    }

    @mod
    @expects(ArgType.Number)
    @expects(ArgType.Message)
    private accept(params: CommandParameters){
        respondToSuggestion(params.message, <[string, string]> params.input, SuggestionResponse.ACCEPTED);
    }

    @mod
    @expects(ArgType.Number)
    @expects(ArgType.Message)
    private reject(params: CommandParameters){
        respondToSuggestion(params.message, <[string, string]> params.input, SuggestionResponse.REJECTED);
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
        EmbedBuilder.getInstance().sendEmbed(params.message);
    }

    @expects(ArgType.Message, {optional: true})
    private help(params: CommandParameters){
        getHelp(params.message, params.args, params.database)
    }

    @expects(ArgType.None)
    private passives(params: CommandParameters){
        passives(params.message);
    }

    @expects(ArgType.Member)
    private pfp(params : CommandParameters){
        pfp(params.message, params.args);
    }

    @expects(ArgType.None)
    private uptime(params : CommandParameters){
        uptime(params.message, params.bot);
    }

    @expects(ArgType.String, {optional: true})
    private source(params: CommandParameters){
        source(params.message, params.args);
    }

    @throttle(3)
    @expects(ArgType.None)
    private ch(params: CommandParameters){
        ch(params.message);
    }

    @expects(ArgType.None)
    private serverInfo(params: CommandParameters){
        serverInfo(params.message);
    }

    @expects(ArgType.None)
    private botInfo(params: CommandParameters){
        botInfo(params.message);
    }

    @expects(ArgType.None)
    private macros(params: CommandParameters){
        listMacros(params.message)
    }

    @expects(ArgType.None)
    private bump(params : CommandParameters){
        bump(params.message);
    }

    @expects(ArgType.None)
    private randomQuote(params: CommandParameters){
        randomQuote(params.message);
    }

    @expects(ArgType.None)
    private doggo(params: CommandParameters){
        doggo(params.message);
    }

    @expects(ArgType.None)
    private iHateYou(params: CommandParameters){
        iHateYou(params.message);
    }

    @expects(ArgType.Message)
    private suggest(params: CommandParameters){
        suggest(params.message, <[string]> params.input);
    }

    @expects(ArgType.None)
    private setSuggestions(params: CommandParameters){
        setSuggestionsChannel(params.message);
    }

    @expects(ArgType.None)
    private invite(params: CommandParameters){
        invite(params.message);
    }

    @expects(ArgType.None)
    private ping(params: CommandParameters){
        ping(params.message);
    }

    @throttle(3)
    @expects(ArgType.Message)
    private anime(params: CommandParameters){
        Anime.getInstance().getAnime(params.message, <[string]> params.input);
    }

    @expects(ArgType.None)
    private daily(params: CommandParameters){
        daily(params.message);
    }

    @expects(ArgType.Member, {optional: true})
    private balance(params: CommandParameters){
        balance(params.message, <[(GuildMember | undefined)]> params.input);
    }

    // @expect(ArgType.Message)
    // private character(params: CommandParameters){
    //     Anime.getInstance().getCharacter(params.message, <[string]> params.input);
    // }
}
