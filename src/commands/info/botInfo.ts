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
                .setThumbnail(avatar)
                .setTitle('Hifumi')
                .setColor('#ffd275')
                .addField(`Owner`, `<@${gb.ownerID}>`, true)
                .addField(`Version`, `0.1.0`, true)
                .addField(`Language`, `Typescript`, true)
                .addField(`Database`, `Postgres`, true)
                .addField(`Hosting`, `Heroku`, true)
                .addField(`Commands`, commands, true)
                .setTimestamp()
        )
    }).catch(err => {
        debug.error(err, 'BotInfo');
    });
}
