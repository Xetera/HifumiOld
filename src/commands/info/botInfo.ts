import * as Discord from 'discord.js'
import {Presence, RichEmbed} from "discord.js";
import gb from "../../misc/Globals";
import {debug} from "../../utility/Logging";
const help = require('../help.json');
export default function botInfo(message : Discord.Message) : void {
    if (!message.guild.available)
        return;
    const commands = help.commands.length;
    message.channel.send(
        new RichEmbed()
            .setThumbnail(message.guild.me.user.avatarURL)
            .setTitle('Hifumi')
            .setColor('#ffd275')
            .addField(`Owner`, `Xetera#9596`, true)
            .addField(`Version`, `1.7.0`, true)
            .addField(`Lines of Code`, 9152, true)
            .addField(`Language`, `Typescript`, true)
            .addField(`Database`, `Postgres`, true)
            .addField(`Hosting`, `Heroku`, true)
            .addField(`Commands`, commands, true)
            .setFooter(`Hifumi is the best girl from the anime "New Game!"`)
            .setTimestamp()
    )
}
