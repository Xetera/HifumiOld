import {RichEmbed} from "discord.js";

export const createWarningEmbed = (type: string, message: string) : RichEmbed => {
    let embed = new RichEmbed()
        .setTitle(`!🚫 Process Error`)
        .setColor('#ff0000')
        .setDescription(`There was a system exception.`)
        .addField(`Type`, type)
        .addField(`Message`, message);
    return embed
};