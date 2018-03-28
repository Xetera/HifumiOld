import * as Discord from 'discord.js'
import {Database} from "../database/Database";
import * as dbg from "debug";
import {Instance} from "../misc/Globals";
import {RichEmbed, TextChannel} from "discord.js";

export const debug = {
    silly  : dbg('Bot:onGuildCreate:Silly'),
    info   : dbg('Bot:onGuildCreate:Info'),
    warning: dbg('Bot:onGuildCreate:Warning'),
    error  : dbg('Bot:onGuildCreate:Error')
};
export default function onGuildCreate(guild : Discord.Guild, instance : Instance){
    instance.muteQueue.insertNewGuild(guild);
    instance.database.insertNewGuild(guild);

    debug.info(`I was added to the server: ${guild.name} with ${guild.memberCount} members.`);
    const targetChannel = guild.systemChannel;
    let embed = new RichEmbed()
        .setTitle(`Hello World!`)
        .setThumbnail(instance.bot.user.avatarURL)
        .setColor('GREEN')
        .setDescription(`Oh hey! Thanks for adding me, I was _really_ starting to get bored back there.`)
        .addField(`Features`,
            "I'm here to keep baddies off this wonderful server and help things remain in order.\n" +
            "You can also say my name and I'll try my best to have a conversation with you.")
        .addField(`Getting Started`,
            "You're probably going to have to show me around so I know how things work here.\n" +
            "You can do `.setup` if you want to get started with that.")
        .setFooter(`Default prefix: .`)
        .setTimestamp();

    if (targetChannel&& targetChannel instanceof TextChannel){
        targetChannel.send(embed);
    }

}