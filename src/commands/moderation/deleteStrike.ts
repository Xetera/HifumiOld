import {Message} from "discord.js";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {DeleteResult} from "typeorm";
import {Infraction} from "../../database/models/infraction";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";

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
    }).then(() => {
        return gb.instance.database.deleteInfractionById(id, message.guild.id);
    }).then(() => {
        return safeSendMessage(message.channel, `Strike #${id} has vanished.`);
    }).catch((err: any) => {
        return Promise.reject(err);
    });
}
