import * as Discord from 'discord.js'
import {Message, TextChannel, VoiceChannel} from "discord.js";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import gb from "../../misc/Globals";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import hasMessagingPermissions from "../../handlers/permissions/missingPermissionsHandler";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
export default async function echo(message:Message, input: [TextChannel, string]) {
    const [channel, echo] = input;
    if(!message.member.permissionsIn(channel).has('SEND_MESSAGES')){
        return void handleFailedCommand(message.channel,
            `I can only send messages in channels you're allowed to send messages to.`
        );
    }

    if (message.channel instanceof TextChannel){
        let out;
        // we still want admins to be able to make announcements with this
        if (!message.member.hasPermission('ADMINISTRATOR')){
            out = echo.replace('@', '\`@\`');
        }
        else {
            out = echo;
        }
        safeSendMessage(channel, out);
    }
    else if (channel instanceof VoiceChannel){
        handleFailedCommand(message.channel, channel + ' is not a text channel.');
    }
}
