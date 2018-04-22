import * as Discord from 'discord.js'
import {Database} from "../../database/Database";
import missingAdminEmbed from "../../embeds/permissions/missingAdminEmbed";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import gb from "../../misc/Globals";
import {Guild} from "../../database/models/guild";
import {debug} from "../../utility/Logging";

export default function setPrefix(message: Discord.Message, prefix: string, database: Database){
    if (prefix === undefined)
        return message.channel.send('No prefix was entered.');
    else if (prefix.length > 1)
        return handleFailedCommand(message.channel, `Only single character prefixes are supported right now.`);
    else if (!message.member.hasPermission('ADMINISTRATOR'))
        return message.channel.send(missingAdminEmbed());

    gb.instance.database.setPrefix(message.guild.id, prefix).then((res:Partial<Guild>)=> {
            message.channel.send('Prefix changed to ' + res.prefix);
    }).catch((err:Error)=> {
        debug.error(err, `setPrefix`);
    })
}
