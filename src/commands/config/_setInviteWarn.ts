import {Message} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import catchUnhandledRejections from "../../handlers/process/unhandledRejection";
import {randomRuntimeError} from "../../interfaces/Replies";

export default async function setInviteWarn(message: Message, input: [number]){
    const [limit] = input;

    if (limit > 15){
        return handleFailedCommand(
            message.channel, `If you're going to allow **that** many invites, just allow invites all together.`
        );
    }

    const banLimit = await gb.instance.database.getInviteBanThreshold(message.guild.id);
    if (limit > banLimit){
        return void handleFailedCommand(
            message.channel, `Your current ban limit for invites is ${banLimit}, I can't warn members after banning them.`
        );
    }

    try {
        await gb.instance.database.setInviteWarnThreshold(message.guild.id, limit);
    }
    catch {
        safeSendMessage(message.channel, randomRuntimeError())
    }

    safeSendMessage(message.channel, `Limit for warning on invites is now ${limit}`);

}
