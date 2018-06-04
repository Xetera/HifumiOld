import {User} from "../../database/models/user";
import {Guild, RichEmbed} from "discord.js";
import gb from "../../misc/Globals";
import {IgnoredChannel} from "../../database/models/ignoredChannel";

export default function ignoredUsersEmbed(ignored: [IgnoredChannel[], User[]], guild: Guild){
    const [channels, users] = ignored;
    const embed = new RichEmbed().setTitle(`Ignored Users and Channels`).setColor(`#a36fff`);
    if (!users.length){
        embed.addField('Ignored Members', 'None');
    }
    else {
        // filter non-existing user
        const paredChannels = users.map(user => guild.members.get(user.id))
            .filter(entry => entry != null)
            .map(e => `\`${e!.user.username}#${e!.user.discriminator}\``)
        embed.addField('Ignored Members', paredChannels.join(', '))
    }

    if (!channels.length){
        embed.addField('Ignored Channels', 'None')
    }
    else {
        const paredChannels = channels.map(channel => guild.channels.get(channel.channel_id))
            .filter(entry => entry != null).map(e => `\`${e!.name}\``);
        embed.addField('Ignored Channels', paredChannels.join(', '))
    }

    return embed;
}
