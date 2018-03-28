import {RichEmbed} from "discord.js";

export default function logWarningEmbed(warning: string, details?: string): RichEmbed{
    let out = new RichEmbed()
        .setTitle('Warning ⚠')
        .addField('Description', warning)
        .setTimestamp();
    if (details)
        out.addField('Details', details);
    return out;
}