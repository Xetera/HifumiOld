import {Infraction} from "../../database/models/infraction";
import {Message, RichEmbed} from "discord.js";
import {IInfractionHandler} from "../../interfaces/injectables/infractionHandler.interface";
import {Container} from "typescript-ioc";

export default function deleteStrikeDMEmbed(message: Message, infraction: Infraction){
    const infractionHandler: IInfractionHandler = Container.get(IInfractionHandler);
    return new RichEmbed()
        .setTitle(`Hooray!`)
        .setColor('#91e6ff')
        .setDescription(`The mods in **${message.guild.name}** have deleted one of your previous infractions.`)
        .addField(`Deleted Strike`, infractionHandler.formatInfraction(infraction, true))
}
