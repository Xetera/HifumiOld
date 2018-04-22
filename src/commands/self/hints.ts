import {Message} from "discord.js";
import gb from "../../misc/Globals";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {User} from "../../database/models/user";
import {Guild} from "../../database/models/guild";
import {randomRuntimeError} from "../../interfaces/Replies";

export default async function setHints(message: Message, args: string[]){
    if (!args.length){
        return void await handleInvalidParameters(message.channel, 'hints');
    }

    let state: boolean | string = args.shift()!;
    if (state === 'on'){
        state = true;
    }

    else if (state === 'off'){
        state = false;
    }
    else {
        return void await handleInvalidParameters(message.channel, 'hints');
    }
    gb.instance.database.setCommandHints(message.guild.id, state).then(() => {
        message.channel.send(`Alright, my command hints are ${state ? 'on' : 'off'} now.`);
    }).catch()
}
