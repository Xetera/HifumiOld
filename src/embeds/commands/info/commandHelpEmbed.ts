import {Guild, RichEmbed} from "discord.js";
import {Command} from "../../../handlers/commands/Command";
import {commandEmbedColor} from "../../../utility/Settings";
import {formatAndJoin, formattedTimeString, normalizeString} from "../../../utility/Util";

export default function commandHelpEmbed(command: Command, prefix: string, guild: Guild){
    const [name, ...aliases] = command.names;
    let description = command.info + '\n\n';

    if (command.clientPermissions && command.clientPermissions.length){
        description += (`**I need permissions:** ${formatAndJoin(command.clientPermissions.map(c => normalizeString(c.toString())))}\n`)
    }
    if (command.userPermissions && command.userPermissions){
        description += (`**User needs permission:** \`${normalizeString(command.userPermissions.toString())}\`\n`)
    }

    if (aliases.length){
        description += (`**Aliases:** ${formatAndJoin(aliases)}`)
    }

    const embed = new RichEmbed()
        .setTitle(`Command: ${prefix}${name}`)
        .setDescription(description);

    embed.addField(`Usage`, `\`${command.getUsage(prefix)}\``)
        .addField(`Examples`, `\`${command.getExamples(prefix)}\``)
        .setColor(commandEmbedColor);

    return embed;
}
