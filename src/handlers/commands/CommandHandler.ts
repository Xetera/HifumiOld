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
import admin from "../permissions/decorators/onlyAdmin";
import {Alexa} from "../../API/Alexa";
import {MuteQueue} from "../../moderation/MuteQueue";
import {MessageQueue} from "../../moderation/MessageQueue";
import botOwner from "../permissions/decorators/onlyOwner";
import setName from "../../commands/self/ChangeName";
import setAvatar from "../../commands/self/ChangePicture";
import mod from "../permissions/decorators/onlyMod";
import getQueue from "../../commands/debug/getQueue";
import cleanse from "../../commands/utility/Cleanse";
import bump from "../../commands/self/Bump";
import getConfig from "../../commands/config/getConfig";
import setLogsChannel from "../../commands/config/setLogsChannel";
import getCache from "../../commands/debug/Cache";
import ignore from "../../commands/self/Ignore";
import botInfo from "../../commands/info/botInfo";
import {debug} from "../../utility/Logging";
import {TextChannel} from "discord.js";
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
import {ICachedMacro, IMacro} from "../../database/TableTypes";
import listMacros from "../../commands/utility/listMacros";
import deleteMacro from "../../commands/utility/deleteMacro";

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
    restarting: boolean;
    constructor(){
        this.commands = (Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(method=> {
            return method !== 'constructor'
                && method !== 'handler'
                && method !== 'parseInput'
                && method !== 'restarting';
        }));
        this.restarting = false;
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
        // TODO: fix this for stealth commands
        if (command !== undefined) {
            command = command.substring(1);
            return [command, args];
        }
        else {
            return ['', ['']]
        }
    }

    public async handler(message : Discord.Message,instance : Instance) {
        if (this.restarting)
            return;
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
            //message.react(gb.emojis.get('alexa_ack')!);
            try {
                return this[execution](params);
            }
            catch (error) {
                debug.error(`Unexpected error while executing ${command}\n` + error.stack)
            }
        }
        if (command === null){
            return;
        }
        const macros: ICachedMacro[] = gb.instance.database.getMacros(message.guild);
        let targetMacro: ICachedMacro | undefined;
        if (macros.length){
            targetMacro = macros.find(macro => macro.macro_name === command);
            if (targetMacro){
                return void message.channel.send(targetMacro.macro_content);
            }
        }

        const hints = instance.database.getCommandHints(message.guild);
        if (hints){
            message.channel.send(
                commandNotFoundEmbed(message.channel, command, macros.map(macro => macro.macro_name))
            );
        }
    }

    @botOwner
    private setName(params: CommandParameters){
        const name = params.args.join(' ');
        setName(params.message, name);
    }
    /* Owner Commands */
    @botOwner
    private setAvatar(params: CommandParameters){
        setAvatar(params.message, params.args[0]);
    }

    @botOwner
    private eval(params: CommandParameters){
        systemsEval(params)
    }

    @botOwner
    private restock(params : CommandParameters){
        manualRestockUsers(params.message, params.database);
    }

    @botOwner
    private queue(params : CommandParameters){
        getQueue(params.message, params.messageQueue);
    }

    @botOwner
    private cache(params: CommandParameters){
        getCache(params.message, params.database);
    }

    @botOwner
    private test(params: CommandParameters){
        /*Testing Commands*/
        //setupMutePermissions(params.message);
    }

    @botOwner
    private guilds(params: CommandParameters){
        params.message.channel.send(params.bot.guilds.array().map(g => `${g.name}: ${g.id} Members:${g.memberCount}`).join('\n'));
    }


    /* Admin Commands */
    @admin
    private setPrefix(params: CommandParameters){
        setPrefix(params.message, params.args[0], params.database);
    }

    @admin
    private setup(params: CommandParameters){
        createMuteRole(params.message);
    }

    @admin
    private inviteFilter(params: CommandParameters){
        setInvites(params.message, params.args);
    }

    /* Mod Commands */
    @mod
    private config(params : CommandParameters){
        getConfig(params.message, params.database);
    }

    @mod
    private ignore(params : CommandParameters){
        const user = params.message.mentions.members.first();
        ignore(params.message, user, params.database);
    }

    @mod
    private nuke(params: CommandParameters){
        nuke(params.message.channel, parseInt(params.args[0]));
    }

    @mod
    private cleanse(params: CommandParameters){
        const limit : string | undefined = params.args.shift()!;
        cleanse(params.message.channel, params.database, parseInt(limit))
    }

    @mod
    private mute(params: CommandParameters){
        muteUser(params.message, params.args);
    }

    @mod
    private setWelcome(params : CommandParameters){
        setWelcome(params.message, params.database);
    }

    @mod
    private setLogs(params : CommandParameters){
        setLogsChannel(params.message, params.database);
    }

    @mod
    private setWarnings(params: CommandParameters){
        setWarningsChannel(params.message);
    }

    @mod
    private addMacro(params: CommandParameters){
        addMacro(params.message, params.args);
    }

    @mod
    private listMacros(params: CommandParameters){
        listMacros(params.message)
    }

    @mod
    private deleteMacro(params: CommandParameters){
        deleteMacro(params.message, params.args);
    }

    @mod
    private echo(params : CommandParameters){
        echo(params.message, params.args)
    }

    @mod
    private hints(params: CommandParameters){
        setHints(params.message, params.args);
    }

    @mod
    private mutedUsers(params: CommandParameters){
        getMuted(params.message);
    }

    @mod
    private note(params: CommandParameters){
        setNote(params.message, params.args);
    }

    @mod
    private deleteNote(params: CommandParameters){
        deleteNote(params.message, params.args);
    }

    @mod
    public history(params: CommandParameters){
        getHistory(params.message, params.args);
    }
    /* Public Commands */
    private help(params: CommandParameters){
        getHelp(params.message, params.args, params.database)
    }

    private passives(params: CommandParameters){
        passives(params.message);
    }

    private pfp(params : CommandParameters){
        pfp(params.message, params.args);
    }

    private uptime(params : CommandParameters){
        uptime(params.message, params.bot);
    }

    private source(params: CommandParameters){
        source(params.message, params.args);
    }

    private ch(params: CommandParameters){
        ch(params.message);
    }

    private serverInfo(params: CommandParameters){
        serverInfo(params.message);
    }

    private botInfo(params: CommandParameters){
        botInfo(params.message);
    }

    private bump(params : CommandParameters){
        bump(params.message);
    }
}
