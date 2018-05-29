import * as Discord from 'discord.js'
import * as dbg from "debug";
import {getHelp} from "./help/Help";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {GuildMember} from "discord.js";
import pfpEmbed from "../../embeds/commands/pfpEmbed";

export const debug = {
    silly  : dbg('Bot:PFP:Silly'),
    info   : dbg('Bot:PFP:Info'),
    warning: dbg('Bot:PFP:Warning'),
    error  : dbg('Bot:PFP:Error')
};
export default async function pfp(message: Discord.Message, input: [GuildMember]){
    const [user] = input;

    let url = user.user.avatarURL;

    if (url == null){
        return message.channel.send(`${user.user.username} does not have a profile picture.`);
    }

    safeSendMessage(message.channel, pfpEmbed(user));
}
