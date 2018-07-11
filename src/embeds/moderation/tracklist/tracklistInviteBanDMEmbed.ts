import {Guild, RichEmbed} from "discord.js";
import {advertiseOnBan} from "../../../interfaces/Replies";

export default function tracklistInviteBanDMEmbed(guild: Guild): RichEmbed{
    return new RichEmbed()
        .setTitle(`Banned ⛔`)
        .setColor('#FF0000')
        .setDescription(
            `You were banned in \`${guild.name}\` for posting 2 invites as a tracked member.`+
            `\n\n${advertiseOnBan()}`)
        .setImage('https://github.com/ilocereal/Hifumi/raw/master/assets/banners/hifumi_new.png')
        .setTimestamp()
}
