import {RichEmbed, Role} from "discord.js";

export default function createMuteRoleEmbed(role: Role, channelCount: number, categoryCount: number){
    return new RichEmbed()
        .setTitle(`Success!`)
        .addField(`Role Name`, role)
        .addField(`Channels Modified`, channelCount)
        .addField(`Categories Modified`, categoryCount)
}
