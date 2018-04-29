import {Message} from "discord.js";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {debug} from "../../utility/Logging";
import guildMemberAddEmbed from "../../embeds/events/onGuildMemberAddEmbed";

export default function setGreeting(message: Message, input: [string]){
    const [welcome] = input;
    if (welcome.length > 600){
        return void handleFailedCommand(
            message.channel, `That message is WAY too long, my welcomes will become really annoying`
        );
    }
    gb.instance.database.setWelcomeMessage(message.guild.id, welcome).then(() => {
        safeSendMessage(message.channel, guildMemberAddEmbed(message.member, welcome));
    }).catch(err => {
        debug.error(err, `setWelcomeMessage`);
    })
}
