import * as Discord from 'discord.js'
import {MuteQueue} from "../moderation/MuteQueue";
import {MessageQueue} from "../moderation/MessageQueue";
import {Database} from "../database/Database";
import {Message} from "discord.js";
import Tracklist from "../moderation/Tracklist";

export type emojiName = string;
export interface Instance {
    bot: Discord.Client,
    muteQueue: MuteQueue,
    messageQueue: MessageQueue,
    database : Database,
    trackList: Tracklist,
    heroku: any
    eval(message: Message, x : any): any
}
