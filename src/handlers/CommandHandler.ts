import nuke from "../commands/utility/Nuke";
import * as Discord from "discord.js";
import * as dbg from "debug";
import {Database} from "../database/Database";
import setDefaultChannel from "../commands/utility/SetDefaultChannel";
import setPrefix from "../commands/utility/SetPrefix";
import systemsEval from "../commands/self/Eval";
import manualRestockUsers from "../actions/ManualRestockUsers";
import getPfp, {default as pfp} from "../commands/info/GetPfp";
import uptime from "../commands/info/Uptime";
import source from "../commands/info/Source";
import ch from "../commands/fun/CyanideAndHappiness";
import {getHelp} from "../commands/info/Help";
import serverInfo from "../commands/info/ServerInfo";
import echo from "../commands/utility/Echo";
import {Instance} from "../misc/Globals";
import onlyAdmin from "./permissions/decorators/onlyAdmin";
import {Alexa} from "../API/Alexa";
import {MuteQueue} from "../moderation/MuteQueue";
import {MessageQueue} from "../moderation/MessageQueue";
import onlyOwner from "./permissions/decorators/onlyOwner";
import setName from "../commands/self/ChangeName";
import setAvatar from "../commands/self/ChangePicture";
import onlyMod from "./permissions/decorators/onlyMod";

interface CommandParameters extends Instance {
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

export const debug = {
    silly  : dbg('Bot:CommandHandler:Silly'),
    info   : dbg('Bot:CommandHandler:Info'),
    warning: dbg('Bot:CommandHandler:Warning'),
    error  : dbg('Bot:CommandHandler:Error')
};


export default class CommandHandler implements indexSignature {
    [method:string]: any;
    commands : string[];

    constructor(){
        this.commands = (Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(method=>{
            return method !== 'constructor' && method !== 'handler';
        }));
    }

    public handler(message : Discord.Message,instance : Instance){
        const contentArray : string[] = message.content.split(' ');
        const command : string = contentArray[0].substring(1).toLowerCase();
        const args : string[] = contentArray.splice(1, contentArray.length);

        debug.info(`[${message.guild.name}]<${message.author.username}>: ${message.content}`);

        const params : CommandParameters = {
            message: message,
            args: args,
            bot: instance.bot,
            alexa: instance.alexa,
            muteQueue: instance.muteQueue,
            messageQueue: instance.messageQueue,
            database : instance.database
        };

        for (let i in this.commands){
            const match = this.commands[i].match(new RegExp(command, 'i'));
            console.log(match);
            if (match)
                return this[match[0]](params);
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
        systemsEval(params.message, params.args.join(' '))
    }

    @onlyOwner
    private restock(params : CommandParameters){
        manualRestockUsers(params.message, params.database);
    }

    /* Admin Commands */

    @onlyAdmin
    private setPrefix(params: CommandParameters){
        setPrefix(params.message, params.args[0], params.database);
    }

    /* Mod Commands */
    @onlyMod
    private nuke(params: CommandParameters){
        nuke(params.message.channel, parseInt(params.args[0]));
    }

    @onlyMod
    private setDefault(params : CommandParameters){
        setDefaultChannel(params.message, params.database);
    }

    @onlyMod
    private echo(params : CommandParameters){
        echo(params.message, params.args)
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
        source(params.message);
    }

    private ch(params: CommandParameters){
        ch(params.message);
    }

    private serverInfo(params: CommandParameters){
        serverInfo(params.message);
    }
}