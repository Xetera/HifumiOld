import {Guild, RichEmbed} from "discord.js";
import gb from "../../misc/Globals";

export default function passivesEmbed(guild: Guild){
    const prefix = gb.instance.database.getPrefix(guild.id);
    return new RichEmbed()
        .setTitle(`__**Passives**__`)
        .setDescription(`Here's everything I'm capable of without commands!`)
        .addField(`**Anti Spam**`, `I automatically mute users who spam messages too fast.`)
        .addField(`**New User Tracking**`,
            'I have my magnifying glass over new users for a short amount of time. Annoying things that would normally ' +
            'get regular members muted like spamming, sending advertisements and mentioning everyone get new members banned instead.')
        .addField(`**Logging**`, `I keep track of everything I do on your server (if you've selected a channel for me to log to with ${prefix}setlogs before) including joins, leaves and new channels.`)
        .addField(`**Watchlist**`,
            "People I auto ban get placed in my watchlist with a certain percentage certainty of being trolls. " +
            "When someone on the watchlist joins your server I'll warn moderators about their record including info on the reason for their ban, the time it took them to get banned, the server size and more.")
        .addField(`**Chat**`, `Talk to me! I'll reply to your messages if you mention or ping me.`)
        .setFooter(`Prefix: ${prefix}`);
}
