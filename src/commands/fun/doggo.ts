import {Message} from "discord.js";
import axios, {AxiosResponse} from "axios";
import {DoggoEndpoint} from "../endpoints/doggoEndpoint";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import doggoEmbed from "../../embeds/commands/fun/doggoEmbed";
import {random} from "../../utility/Util";
import {debug} from "../../utility/Logging";

export default async function doggo(message: Message){
    const placeholder = <Message> await safeSendMessage(message.channel, random(DoggoEndpoint.placeholders));
    axios.get(DoggoEndpoint.random).then((r: AxiosResponse<DoggoEndpoint.IDoggoResponse>) => {
        placeholder.edit(doggoEmbed(r.data.message));
    }).catch(err => {
        debug.error(err.stack, `DoggoEndpoint`);
        placeholder.edit(`Oh no I couldn't get a pupper... maybe they're all sleeping.`)
    })
}
