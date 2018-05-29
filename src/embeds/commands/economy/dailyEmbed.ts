import {default as EconomyHandler, ICurrency} from "../../../handlers/economy/economyHandler";
import {Guild, RichEmbed} from "discord.js";
import gb from "../../../misc/Globals";
import ReactionManager from "../../../handlers/internal/reactions/reactionManager";
import {random} from "../../../utility/Util";

export default function dailyEmbed(guild: Guild, dailyAmount: number, curr: ICurrency, streak: number, fresh: boolean){
    let money;
    if (!fresh) {
        money = EconomyHandler.formatMoney(dailyAmount, true, true)
    }
    else {
        money = EconomyHandler.formatMoney(dailyAmount / 10, true, true)
    }
    const embed = new RichEmbed()
        .setTitle(`Payday!`)
        .setDescription(
            `The Bank of Hifumi has given you ${money}${fresh ? `\n_**AND**_ an additional ${EconomyHandler.formatMoney(dailyAmount - (dailyAmount/10), true, true)} as a first-time bonus!` : ''}\n\n`+
            `**__Current Balance:__**\n\n` +
            `${gb.emojis.get('hifumi_gold')} **${curr.g}**\t` +
            `${gb.emojis.get('hifumi_silver')} **${curr.s}**\t` +
            `${gb.emojis.get('hifumi_copper')} **${curr.c}**\n`)
        .setColor(`#ffa9e6`)
        .setThumbnail(`https://media.giphy.com/media/PqVBpJna7r8Gs/giphy.gif`)

    if (streak > 1){
        embed.setFooter(`You are on a ${streak} day streak.`);
    }
    return embed;
}
