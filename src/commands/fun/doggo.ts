import {Message} from "discord.js";
import axios, {AxiosResponse} from "axios";
import {DoggoEndpoint} from "../endpoints/doggoEndpoint";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import doggoEmbed from "../../embeds/commands/fun/doggoEmbed";
import {random} from "../../utility/Util";
import {debug} from "../../utility/Logging";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";

function handleDogFail(placeholder: Message){
    placeholder.edit(`Oh no I couldn't get a pupper... maybe they're all sleeping.`);
}
async function run(message: Message): Promise<any> {
    const placeholder = <Message> await safeSendMessage(message.channel, random(DoggoEndpoint.placeholders));

    let r: AxiosResponse<DoggoEndpoint.IDoggoResponse>;
    try {
        r = await axios.get(DoggoEndpoint.random);
    }
    catch (err) {
        debug.error(err.stack, `DoggoEndpoint`);
        return void handleDogFail(placeholder);
    }
    if (r.status !== 200){
       return void handleDogFail(placeholder);
    }

    placeholder.edit(doggoEmbed(r.data.message));
}

export const command: Command = new Command(
    {
        names: ['dog', 'doggo'],
        info: 'Sends a random doggy',
        usage: '{{prefix}}dog',
        examples: ['{{prefix}}dog'],
        category: 'Fun',
        expects: [{type: ArgType.None}],
        run: run
    }
);

