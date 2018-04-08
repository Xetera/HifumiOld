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
import {TextChannel} from "discord.js";
import identifyMuteRole from "../../commands/config/checkChannelPermissions";
import createMuteRole from "../../commands/config/createMuteRole";
import muteUser from "../../commands/moderation/mute";
import setupMutePermissions from "../../commands/config/setupMutePermissions";
import commandNotFoundEmbed from "../../embeds/commands/commandNotFoundEmbed";
import setHints from "../../commands/self/hints";

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
    @onlyOwner
    private setAvatar(params: CommandParameters){
        setAvatar(params.message, params.args[0]);
    }

    @onlyOwner
    private eval(params: CommandParameters){
        systemsEval(params)
    }

    @onlyOwner
    private restock(params : CommandParameters){
        manualRestockUsers(params.message, params.database);
    }

    @onlyOwner
    private queue(params : CommandParameters){
        getQueue(params.message, params.messageQueue);
    }

    @onlyOwner
    private cache(params: CommandParameters){
        getCache(params.message, params.database);
    }

    private test(params: CommandParameters){
        /*Testing Commands*/
        setupMutePermissions(params.message);
    }
    /* Admin Commands */

    @onlyAdmin
    private setPrefix(params: CommandParameters){
        setPrefix(params.message, params.args[0], params.database);
    }

    @onlyAdmin
    private setup(params: CommandParameters){
        createMuteRole(params.message);
    }

    /* Mod Commands */
    @onlyMod
    private config(params : CommandParameters){
        getConfig(params.message, params.database);
    }

    @onlyMod
    private ignore(params : CommandParameters){
        const user = params.message.mentions.members.first();
        ignore(params.message, user, params.database);
    }

    @onlyMod
    private nuke(params: CommandParameters){
        nuke(params.message.channel, parseInt(params.args[0]));
    }

    @onlyMod
    private cleanse(params: CommandParameters){
        const limit : string | undefined = params.args.shift()!;
        cleanse(params.message.channel, params.database, parseInt(limit))
    }

    @onlyMod
    private mute(params: CommandParameters){
        muteUser(params.message, params.args);
    }

    @onlyMod
    private setWelcome(params : CommandParameters){
        setWelcome(params.message, params.database);
    }

    @onlyMod
    private setLogs(params : CommandParameters){
        setLogsChannel(params.message, params.database);
    }
    @onlyMod
    private echo(params : CommandParameters){
        echo(params.message, params.args)
    }

    @onlyMod
    private hints(params: CommandParameters){
        setHints(params.message, params.args);
    }
    /* Public Commands */
    private help(params: CommandParameters){
        getHelp(params.message, params.args, params.database)
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
