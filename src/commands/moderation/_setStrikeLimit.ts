import {Message} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import resolveBooleanUncertainty from "../../resolvers/resolveBooleanUncertainty";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

export default async function _setStrikeLimit(message: Message, input: [number]){
    const database: IDatabase = Container.get(IDatabase)
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

    await database.setGuildColumn(message.guild.id, 'infraction_limit', limit);
    safeSendMessage(message.channel, `Members in this server will now have to get up to **${limit}** infractions before getting banned.`);
}
