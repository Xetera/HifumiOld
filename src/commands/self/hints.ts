import {Message} from "discord.js";
import gb from "../../misc/Globals";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";

export default function setHints(message: Message, args: string[]){
    if (!args.length){
        return void handleInvalidParameters(message.channel, 'hints');
    }
    let state: boolean | string = args.shift()!;
    if (state === 'on'){
        state = true;
    }
    else if (state === 'off'){
        state = false;
    }
    else {
        return void handleInvalidParameters(message.channel, 'hints');
    }
    gb.instance.database.setCommandHints(message.guild, state).then(response => {
        console.log(response);
        message.channel.send(`Alright, my command hints are ${response ? 'on' : 'off'} now.`);
    })
}
