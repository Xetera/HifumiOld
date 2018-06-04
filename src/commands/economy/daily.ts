import gb from "../../misc/Globals";
import {Message} from "discord.js";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import EconomyHandler, {ICurrency} from "../../handlers/economy/economyHandler";
import {formattedTimeString} from "../../utility/Util";
import dailyEmbed from "../../embeds/commands/economy/dailyEmbed";
import dailyNotReadyEmbed from "../../embeds/commands/economy/dailyNotReadyEmbed";

export default async function daily(message: Message){
    const database = gb.instance.database;
    const ready = await database.isDailyUsable(message.guild.id, message.author.id);
    let dailyAmount = 105;
    if (typeof ready !== 'number'){
        if (ready === 'fresh'){
            dailyAmount = 10 * dailyAmount;
        }
        const isOnStreak = await database.isOnStreak(message.guild.id, message.member.id);
        let streak;
        if (!isOnStreak){
            await database.resetStreak(message.guild.id, message.member.id);
            streak = 1;
        }
        else {
            streak = await database.getStreak(message.guild.id, message.author.id);
        }
        const updateAmount = EconomyHandler.calculateStreak(streak + 1 , dailyAmount);
        const updateResult = await database.triggerDaily(message.guild.id, message.author.id, updateAmount,  streak + 1);
        const newCopper = updateResult.raw[0].copper;
        const formatted: ICurrency = EconomyHandler.formatMoney(newCopper, false);
        safeSendMessage(message.channel, dailyEmbed(message.guild, updateAmount, formatted, streak + 1, ready === 'fresh'));
    }
    else {
        safeSendMessage(message.channel, dailyNotReadyEmbed(ready/ 1000));
    }
}
