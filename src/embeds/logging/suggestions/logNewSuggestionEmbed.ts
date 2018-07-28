import {Container} from "typescript-ioc";
import {GuildMember, RichEmbed} from "discord.js";
import {IDatabase} from "../../../interfaces/injectables/datbase.interface";

export default async function logNewSuggestionEmbed(member: GuildMember){
    const database: IDatabase = Container.get(IDatabase)
    const prefix = await database.getPrefix(member.guild.id);

    return new RichEmbed()
        .setTitle(`New Suggestion`)
        .setColor(`#f8b3ff`)
        .setDescription(`A new suggestion was submitted by ${member}\nUse **${prefix}suggestions** to view their request.`);
}
