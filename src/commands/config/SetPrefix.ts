import * as Discord from 'discord.js'
import {IGuild, isIGuild} from "../../database/TableTypes";
import {Database} from "../../database/Database";
import * as dbg from "debug";
import {adminOnlyCommand} from "../../interfaces/Replies";
import onlyOwner from "../../handlers/permissions/decorators/onlyAdmin";
import missingAdminEmbed from "../../embeds/permissions/missingAdminEmbed";
import {handleFailedCommand} from "../../handlers/commands/invalidCommandHandler";

export const debug = {
    error  : dbg('Bot:setPrefix:Error')
};


export default function setPrefix(message: Discord.Message, prefix: string, database: Database){
    if (prefix === undefined)
        return message.channel.send('No prefix was entered.');
    else if (prefix.length > 1)
        return handleFailedCommand(message.channel, `Only single character prefixes are supported right now.`);
    else if (!message.member.hasPermission('ADMINISTRATOR'))
        return message.channel.send(missingAdminEmbed());

    database.setPrefix(message.guild, prefix).then((res:IGuild|Error|-1 )=> {
        if (isIGuild(res))
            message.channel.send('Prefix changed to ' + res.prefix);
        else {
            debug.error('Error while setting prefix.', res);
        }
    });
}