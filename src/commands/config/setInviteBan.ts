import {Message} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {randomRuntimeError} from "../../interfaces/Replies";
import gb from "../../misc/Globals";
import warn from "../moderation/warn";

export default async function setInviteBan(message: Message, input: [number]){
    const [limit] = input;

    if (limit > 15){
        return handleFailedCommand(
            message.channel, `If you're going to allow **that** many invites, just allow invites all together.`
        );
    }

    const warnLimit = await gb.instance.database.getInviteWarnThreshold(message.guild.id);
    if (limit < warnLimit){
        return void handleFailedCommand(
            message.channel, `Your current invite warning limit is ${warnLimit}, I can't ban members before warning them`
        );
    }

    try {
        await gb.instance.database.setInviteBanThreshold(message.guild.id, limit);
    }
    catch {
        safeSendMessage(message.channel, randomRuntimeError())
    }

    safeSendMessage(message.channel, `Limit for banning on invites is now ${limit}`);
}
