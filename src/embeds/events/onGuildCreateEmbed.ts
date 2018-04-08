import {RichEmbed} from "discord.js";
import gb from "../../misc/Globals";
export default function onGuildCreateEmbed(): RichEmbed {
    return new RichEmbed()
        .setTitle(`Hello World!`)
        .setThumbnail(gb.instance.bot.user.avatarURL)
        .setColor('GREEN')
        .setDescription(`Oh hey! Thanks for adding me, I was _really_ starting to get bored back there.`)
        .addField(`Features`,
            "I'm here to keep baddies off this wonderful server and help things remain in order.\n" +
            "You can also say my name and I'll try my best to have a conversation with you.")
        .addField(`Getting Started`,
            "You're probably going to have to show me around so I know how things work here.\n" +
            "You can do `$setup` **WIP** if you want to get started with that and `$help` for command info.")
        .setFooter(`Default prefix: $`)
        .setTimestamp();
}
