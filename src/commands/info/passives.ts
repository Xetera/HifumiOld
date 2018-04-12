import passivesEmbed from "../../embeds/commands/passivesEmbed";
import {Message} from "discord.js";

export default function passives(message: Message){
    message.channel.send(passivesEmbed(message.guild));
}
