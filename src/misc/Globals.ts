import * as Discord from 'discord.js'
import {Cleverbot} from "../API/Cleverbot";
import {MuteQueue} from "../moderation/MuteQueue";
import {MessageQueue} from "../moderation/MessageQueue";
import {Database} from "../database/Database";
import {Environments} from "../events/systemStartup";
import CommandHandler, {CommandParameters} from "../handlers/commands/CommandHandler";
import {Message, Snowflake} from "discord.js";
import Tracklist from "../moderation/Tracklist";
import {LogManager} from "../handlers/logging/logManager";

export type emojiName = string;
interface Globals {
    ownerID: string;
    emojiGuild: Discord.Guild;
    ENV: Environments;
    allMembers: number;
    emojis: Map<emojiName, Discord.Emoji>;
    instance: Instance;
}

export interface Instance {
    bot: Discord.Client,
    alexa: Cleverbot,
    muteQueue: MuteQueue,
    messageQueue: MessageQueue,
    database : Database,
    commandHandler?:CommandHandler,
    trackList: Tracklist,
    heroku: any
    eval(params: CommandParameters, message: Message, x : any): any
}

let gb : Globals = <Globals>{};
export default gb;
