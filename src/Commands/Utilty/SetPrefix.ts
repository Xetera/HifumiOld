import * as Discord from 'discord.js'
import {IGuild, isIGuild} from "../../Database/TableTypes";
import {Database} from "../../Database/Database";
import * as dbg from "debug";

export const debug = {
    error  : dbg('Bot:setPrefix:Error')
};

export default function setPrefix(message: Discord.Message, prefix: string, database: Database){
    database.setPrefix(message.guild.id, prefix).then((res:IGuild|Error|-1 )=> {
        if (isIGuild(res))
            message.channel.send('Prefix changed to ' + res.prefix);
        else {
            debug.error('Error while setting prefix.', res);
        }
    });
}