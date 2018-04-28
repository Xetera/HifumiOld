import passivesEmbed from "../../embeds/commands/passivesEmbed";
import {Message} from "discord.js";

export default async function passives(message: Message){
    message.channel.send(await passivesEmbed(message.guild));
}
