import {Message} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {randomRuntimeError} from "../../interfaces/Replies";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

export default async function setInviteWarn(message: Message, input: [number]){
    const [limit] = input;

    if (limit > 15){
        return handleFailedCommand(
            message.channel, `If you're going to allow **that** many invites, just allow invites all together.`
        );
    }

    const database: IDatabase = Container.get(IDatabase);
    const banLimit = await database.getGuildColumn(message.guild.id, 'invite_ban_threshold');
    if (!banLimit){
        return safeSendMessage(message.channel, randomRuntimeError());
    }
    if (limit > banLimit){
        return void handleFailedCommand(
            message.channel, `Your current ban limit for invites is ${banLimit}, I can't warn members after banning them.`
        );
    }

    try {
        await database.setGuildColumn(message.guild.id, 'invite_warn_threshold', limit);
    }
    catch {
        safeSendMessage(message.channel, randomRuntimeError())
    }

    safeSendMessage(message.channel, `Limit for warning on invites is now ${limit}`);

}
