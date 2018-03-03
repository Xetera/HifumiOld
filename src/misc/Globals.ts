import * as Discord from 'discord.js'
import {Alexa} from "../API/Alexa";
import {MuteQueue} from "../moderation/MuteQueue";
import {MessageQueue} from "../moderation/MessageQueue";
import {Database} from "../database/Database";
import {Environments} from "../events/systemStartup";
import CommandHandler from "../handlers/CommandHandler";
import {Snowflake} from "discord.js";
import Watchlist from "../moderation/Watchlist";

interface Globals {
    ownerID: string;
    emojiGuild: Discord.Guild;
    ENV: Environments;
    allMembers:number;
    emojis: Discord.Collection<Discord.Snowflake, Discord.Emoji>;
}

export interface Instance {
    bot: Discord.Client,
    alexa: Alexa,
    muteQueue: MuteQueue,
    messageQueue: MessageQueue,
    database : Database
    commandHandler?:CommandHandler,
    watchlist: Watchlist
}

let gb : Globals = <Globals>{};
export default gb;