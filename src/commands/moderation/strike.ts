import {GuildMember, Message} from "discord.js";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {resolveMember} from "../../resolvers/memberResolver";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import gb from "../../misc/Globals";
import {max} from "moment";
import InfractionHandler from "../../handlers/infractions/InfractionHandler";

export default async function strike(message: Message, input: [GuildMember, number, string]) {
    const [target, weight, reason] = input;
    InfractionHandler.getInstance().addInfraction(message, message.member, target, reason, weight).then(banned => {
        if (banned){
            return message.channel.send(`Banned ${target.user.username}.`);
        }
        return message.channel.send(`Infracted ${target.user.username} for that.`)
    });

}
