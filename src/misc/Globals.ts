import * as Discord from 'discord.js'
import {Cleverbot} from "../API/Cleverbot";
import {MuteQueue} from "../moderation/MuteQueue";
import {MessageQueue} from "../moderation/MessageQueue";
import {Database} from "../database/Database";
import {Environments} from "../events/systemStartup";
import CommandHandler  from "../handlers/commands/CommandHandler";
import {Message} from "discord.js";
import Tracklist from "../moderation/Tracklist";
import {StatsD} from 'hot-shots'

export type emojiName = string;
interface Globals extends Instance {
    ownerID: string;
    emojiGuild: Discord.Guild;
    ENV: Environments;
    allMembers: number;
    emojis: Map<emojiName, Discord.Emoji>;
    sleeping: boolean;
    bot: Discord.Client,
    hifumi: Cleverbot,
    muteQueue: MuteQueue,
    messageQueue: MessageQueue,
    database : Database,
    commandHandler:CommandHandler,
    trackList: Tracklist,
}

export interface Instance {
    bot: Discord.Client,
    hifumi: Cleverbot,
    muteQueue: MuteQueue,
    messageQueue: MessageQueue,
    database : Database,
    commandHandler:CommandHandler,
    trackList: Tracklist,
    stats: StatsD;
    debugEval(message: Message, x : any): any
}

export let gb : Globals = <Globals>{
    sleeping: false
};
