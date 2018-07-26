import {Message} from "discord.js";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {DeleteResult} from "typeorm";
import {Infraction} from "../../database/models/infraction";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import safeMessageUser from "../../handlers/safe/SafeMessageUser";
import deleteStrikeDMEmbed from "../../embeds/moderation/deleteStrikeDMEmbed";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";


enum EStrikeRejections {
    NO_STRIKE = 'no such strike',
    ILLEGAL_DELETE = 'Illegal strike delete attempt'
}


async function run(message: Message, input: [number]): Promise<any> {
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
        const [, infraction] = r;
        return Promise.all([safeSendMessage(message.channel, `Strike #${id} has vanished.`), infraction]);
    }).then((r: [Message | Message[] | void, Infraction]) => {
        const [, infraction] = r;
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

export const command: Command = new Command(
    {
        names: ['deletestrike', 'delstrike', 'dels'],
        info: "Deletes a strike from a user's history.",
        usage: '{{prefix}}deletestrike { strike id }',
        examples: ['{{prefix}}deletestrike 14'],
        category: 'Moderation',
        expects: [{type: ArgType.Number}],
        run: run,
        userPermissions: UserPermissions.Moderator,
    }
);
