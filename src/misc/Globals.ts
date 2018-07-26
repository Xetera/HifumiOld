import * as Discord from 'discord.js'
import {MuteQueue} from "../moderation/MuteQueue";
import {MessageQueue} from "../moderation/MessageQueue";
import {Database} from "../database/Database";
import {Environments} from "../events/systemStartup";
import {Message} from "discord.js";
import Tracklist from "../moderation/Tracklist";

export type emojiName = string;
interface Globals {
    ownerID: string;
    emojiGuild: Discord.Guild;
    ENV: Environments;
    allMembers: number;
    emojis: Map<emojiName, Discord.Emoji>;
    instance: Instance;
    sleeping: boolean;
}

export interface Instance {
    bot: Discord.Client,
    muteQueue: MuteQueue,
    messageQueue: MessageQueue,
    database : Database,
    trackList: Tracklist,
    heroku: any
    eval(message: Message, x : any): any
}

let gb : Globals = <Globals>{
    sleeping: false
};
export default gb;
