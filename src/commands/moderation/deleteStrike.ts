import {Message} from "discord.js";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {DeleteResult} from "typeorm";
import {Infraction} from "../../database/models/infraction";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import safeMessageUser from "../../handlers/safe/SafeMessageUser";
import deleteStrikeDMEmbed from "../../embeds/moderation/deleteStrikeDMEmbed";

enum EStrikeRejections {
    NO_STRIKE = 'no such strike',
    ILLEGAL_DELETE = 'Illegal strike delete attempt'
}

export default function deleteStrike(message: Message, input: [number]){
    const [id] = input;
    return gb.instance.database.getInfractionById(id).then((r: Infraction|undefined) => {
        if (!r){
            handleFailedCommand(
                message.channel, `There's no such strike`
            );
            return Promise.reject(EStrikeRejections.NO_STRIKE);
        }
        else if (r.guild_id !== message.guild.id){
            handleFailedCommand(
                message.channel, `That strike belongs to another server.`
            );
            return Promise.reject(EStrikeRejections.ILLEGAL_DELETE);
        }
        return Promise.resolve(r);
    }).then((r: Infraction) => {
        return Promise.all([gb.instance.database.deleteInfractionById(id, message.guild.id), r]);
    }).then((r: [DeleteResult, Infraction]) => {
        const [_, infraction] = r;
        return Promise.all([safeSendMessage(message.channel, `Strike #${id} has vanished.`), infraction]);
    }).then((r: [Message | Message[] | void, Infraction]) => {
        const [_, infraction] = r;
        const user = message.guild.members.get(infraction.target_id);
        if (user){
            safeMessageUser(user, deleteStrikeDMEmbed(message, infraction))
        } else {
            safeSendMessage(message.channel,
                `However, I didn't message the user about it. They're either not in the server or they disabled their DMs.`);
        }
    }).catch((err: any) => {
        return Promise.reject(err);
    });
}
