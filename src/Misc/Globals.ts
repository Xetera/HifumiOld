import * as Discord from 'discord.js'
import {Alexa} from "../API/Alexa";
import {MuteQueue} from "../Moderation/MuteQueue";
import {MessageQueue} from "../Moderation/MessageQueue";
import {Database} from "../Database/Database";
import {Environments} from "../Events/systemStartup";

interface Globals {
    ownerID: string;
    ENV: Environments;
}

export interface Instance {
    bot: Discord.Client,
    alexa: Alexa,
    muteQueue: MuteQueue,
    messageQueue: MessageQueue,
    database : Database
}

let gb : Globals = <Globals>{};
export default gb;