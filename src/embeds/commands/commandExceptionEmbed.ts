import {Channel, RichEmbed, TextChannel} from "discord.js";

export function handleFailedCommand(channel: Channel, message : string){
    // we don't want @everyone pings going off because of this
    const out = message.replace('@', '\`@\`');

    let embed = new RichEmbed()
        .setColor('#ff1513')
        .setTitle(`Something went wrong!`)
        .setDescription(out);
    if (out.indexOf('`@`everyone') >= 0){
        // in case we're
        embed.setFooter(`Nice try btw`)
    }
    if (channel instanceof TextChannel)
        channel.send(embed);
}
