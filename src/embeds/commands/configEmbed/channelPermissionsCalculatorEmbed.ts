import {RichEmbed} from "discord.js";

export function missingMuteOverwritesEmbed(channelNames: string[], detectedRole: string){
    return new RichEmbed()
        .setTitle(`Missing Overwrites`)
        .setDescription(
            `I detected \`${detectedRole}\` as your current mute role but it looks like ` +
            `your current permission settings allows muted users to still talk in **${channelNames.length}** channels.`)
        .addField(`Channels`, channelNames.map(channel => '`' + channel + '`').join(', '));
}

export function noMissingMuteOverwritesEmbed(detectedRole: string){
    return new RichEmbed()
        .setTitle(`🎉`)
        .setDescription(`I detected \`${detectedRole}\` as your current mute role and it's perfectly configured, yay!`);
}

export function missingMuteRoleEmbed(prefix: string){
    return new RichEmbed()
        .setTitle(`Oh no`)
        .setDescription(`I couldn't detect any mute role for the server, use ${prefix}setup to fix that`);
}
