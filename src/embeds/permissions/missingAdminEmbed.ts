import {RichEmbed} from "discord.js";

export default function missingAdminEmbed(): RichEmbed{
    return new RichEmbed()
        .setTitle(`Nice try`)
        .setDescription(`Can't let you do that unless you're an admin. 💅`)
        .setColor('#ff0000');
}