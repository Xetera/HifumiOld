import * as Discord from 'discord.js'
import {Presence, RichEmbed} from "discord.js";
import gb from "../../misc/Globals";
import {debug} from "../../utility/Logging";
const help = require('../help.json');
export default function botInfo(message : Discord.Message) : void {
    if (!message.guild.available)
        return;
    gb.instance.bot.fetchApplication().then(app => {
        return app.owner.avatarURL;
    }).then((avatar: string)=> {
        const commands = help.commands.length;
        message.channel.send(
            new RichEmbed()
                .setThumbnail(message.guild.me.user.avatarURL)
                .setTitle('Hifumi')
                .setColor('#ffd275')
                .addField(`Owner`, `Xetera#9596`, true)
                .addField(`Version`, `1.6.0`, true)
                .addField(`Lines of Code`, 9152, true)
                .addField(`Language`, `Typescript`, true)
                .addField(`Database`, `Postgres`, true)
                .addField(`Hosting`, `Heroku`, true)
                .addField(`Commands`, commands, true)
                .setFooter(`Hifumi is a character from the anime "New Game!"`)
                .setTimestamp()
        )
    }).catch(err => {
        debug.error(err, 'BotInfo');
    });
}
