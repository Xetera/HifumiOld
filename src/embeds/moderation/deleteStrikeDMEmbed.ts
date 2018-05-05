import {Infraction} from "../../database/models/infraction";
import {Message, RichEmbed} from "discord.js";
import InfractionHandler from "../../handlers/internal/infractions/InfractionHandler";

export default function deleteStrikeDMEmbed(message: Message, infraction: Infraction){
    return new RichEmbed()
        .setTitle(`Hooray!`)
        .setColor('#91e6ff')
        .setDescription(`The mods in **${message.guild.name}** have deleted one of your previous infractions`)
        .addField(`Details`, InfractionHandler.formatInfraction(infraction, true))
}
