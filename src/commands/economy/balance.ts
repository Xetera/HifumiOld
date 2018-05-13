import {GuildMember, Message} from "discord.js";
import gb from "../../misc/Globals";
import EconomyHandler from "../../handlers/economy/economyHandler";
import balanceEmbed from "../../embeds/commands/economy/balanceEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

export default async function balance(message: Message, input: [(GuildMember | undefined)]){
    const [target] = input;
    let copper;
    let streak;
    if (!target){
        copper = await gb.instance.database.getCopper(message.guild.id, message.author.id);
        streak = await gb.instance.database.getStreak(message.guild.id, message.author.id);
    }
    else {
        copper = await gb.instance.database.getCopper(message.guild.id, target.id);
        streak = await gb.instance.database.getStreak(message.guild.id, target.id);
    }
    const format = EconomyHandler.formatMoney(copper, true);
    const embed = balanceEmbed(target || message.member, format, streak);
    safeSendMessage(message.channel, embed);
}
