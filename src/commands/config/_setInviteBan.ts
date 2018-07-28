import {Message} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {randomRuntimeError} from "../../interfaces/Replies";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

export default async function setInviteBan(message: Message, input: [number]){
    const [limit] = input;

    if (limit > 15){
        return handleFailedCommand(
            message.channel, `If you're going to allow **that** many invites, just allow invites all together.`
        );
    }

    const database: IDatabase = Container.get(IDatabase);
    const warnLimit = await database.getGuildColumn(message.guild.id, 'invite_warn_threshold');
    if (!warnLimit){
        return safeSendMessage(message.channel, randomRuntimeError());
    }

    if (limit < warnLimit){
        return void handleFailedCommand(
            message.channel, `Your current invite warning limit is ${warnLimit}, I can't ban members before warning them`
        );
    }

    try {
        await database.setGuildColumn(message.guild.id, 'invite_warn_threshold',limit);
    }
    catch {
        safeSendMessage(message.channel, randomRuntimeError());
    }

    safeSendMessage(message.channel, `Limit for banning on invites is now ${limit}`);
}

