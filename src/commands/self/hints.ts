import {Message} from "discord.js";
import gb from "../../misc/Globals";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {User} from "../../database/models/user";
import {Guild} from "../../database/models/guild";
import {randomRuntimeError} from "../../interfaces/Replies";

export default async function setHints(message: Message, input: [boolean]){
    const [state] = input;
    gb.instance.database.setCommandHints(message.guild.id, state).then(() => {
        message.channel.send(`Alright, my command hints are **${state ? 'on' : 'off'}** now.`);
    }).catch();
}
