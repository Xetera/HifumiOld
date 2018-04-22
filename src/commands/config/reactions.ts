import {Message} from "discord.js";
import {getOnOff} from "../../utility/Util";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import gb from "../../misc/Globals";
import {Guild} from "../../database/models/guild";
import setReactionsEmbed from "../../embeds/commands/configEmbed/setReactionsEmbed";

export default function reactions(message: Message, args: string[]){
    if (!args.length){
        return handleInvalidParameters(message.channel, 'reactions')
    }
    const state: boolean | undefined = getOnOff(args[0]);
    if (state === undefined){
        return handleFailedCommand(
            message.channel, `**${state}** is not a valid input`
        );
    }

     gb.instance.database.setReactions(message.guild.id, state).then((r: Partial<Guild>) =>{
        // we're setting reactions when we're upserting so it gets reflected
        // back to us for sure
        message.channel.send(setReactionsEmbed(r.reactions!));
    })
}
