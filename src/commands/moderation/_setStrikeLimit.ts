import {Message} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {gb} from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import resolveBooleanUncertainty from "../../resolvers/resolveBooleanUncertainty";

export default async function _setStrikeLimit(message: Message, input: [number]){
    const [limit] = input;
    if (limit > 20){
        return void handleFailedCommand(
            message.channel, `**${limit}** strike limit? That's a little too high don't you think? Try something under 20.`
        );
    }

    const ok = await resolveBooleanUncertainty(
        message,
        `Changing the strike limit doesn't scale the values of previous infractions. ` +
        `This can cause problems with future strikes on members that are close to the limit as it is now, especially when lowering it.`,
        30
    );
    if (!ok)
        return;

    await gb.database.setInfractionLimit(message.guild.id, limit);
    safeSendMessage(message.channel, `Members in this server will now have to get up to **${limit}** infractions before getting banned.`);
}
