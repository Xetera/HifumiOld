import {GuildMember, Message} from "discord.js";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {resolveMember} from "../../resolvers/memberResolver";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import gb from "../../misc/Globals";
import {max} from "moment";
import InfractionHandler from "../../handlers/internal/infractions/InfractionHandler";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

export default async function strike(message: Message, input: [GuildMember, number, string]) {
    const [target, weight, reason] = input;

    if (target.id === target.guild.me.id){
        return safeSendMessage(
            message.channel, {file: 'assets/misc/counterspell.png'}
        );
    }

    else if (target.id === gb.ownerID){
        return handleFailedCommand(
            message.channel, `${weight ? 'strike' : 'warn'} senpai? But I don't want him to spank me again...`
        );
    }

    InfractionHandler.getInstance().addInfraction(message, message.member, target, reason, weight).then(banned => {
        if (banned){
            return message.channel.send(`Banned ${target.user.username}.`);
        }
        return message.channel.send(`Infracted ${target.user.username} for that.`)
    });

}
