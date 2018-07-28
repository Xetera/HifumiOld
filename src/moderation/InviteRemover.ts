import gb from "../misc/Globals";
import safeMessageUser from "../handlers/safe/SafeMessageUser";
import {Offense} from "./interfaces";
import safeDeleteMessage from "../handlers/safe/SafeDeleteMessage";
import {debug} from "../events/onMessage";
import banForInviteSpam from "../actions/punishments/BanForInviteSpam";
import { Message} from "discord.js";
import {LogManager} from "../handlers/logging/logManager";
import inviteWarningDMEmbed from "../embeds/moderation/inviteWarningDM";
import {APIErrors} from "../interfaces/Errors";

export default function deleteInvite(message: Message, editedMessage: boolean = false): Promise<number> {
    import {IDatabase} from "../../interfaces/injectables/datbase.interface";
    import {Container} from "typescript-ioc";
    const database: IDatabase = Container.get(IDatabase)
    const sender = message.author.username;
    const trackList = gb.instance.trackList;
    if (!message.guild.me.hasPermission('MANAGE_MESSAGES')){
       return Promise.reject(new Error(APIErrors.MISSING_PERMISSIONS));
    }
    return safeDeleteMessage(message).then(()=> {
        debug.info(`Deleted invite link from ${sender}`);
        return database.incrementInviteStrike(message.member)
    }).then(async(strikeCount : number) => {
        debug.silly(`${message.member.displayName} has ` + strikeCount + " strikes on record", `InviteListener`);

        const banLimit = await database.getGuildColumn(message.guild.id, 'invite_ban_threshold');
        const warnLimit = await database.getGuildColumn(message.guild.id, 'invite_warn_threshold');

        if (!banLimit || !warnLimit){
            debug.error(`Guild not found ${message.guild.id}`, 'InviteRemover');
            return -1;
        }
        if (trackList.isNewMember(message.member)
            && await database.getGuildColumn(message.guild.id, 'tracking_new_members')
            && strikeCount > 2){

            debug.info(`Advertiser ${message.author.username} was a tracked member, attempting to ban...`, `InviteListener`);
            trackList.punishNewMember(message.member, Offense.InviteLink);
        }
        else if (strikeCount >= banLimit){
            await banForInviteSpam(message.member);
        }
        else if (strikeCount === warnLimit){
            safeMessageUser(message.member, await inviteWarningDMEmbed(message.guild));
        }
        if (!editedMessage){
            LogManager.logIllegalInvite(message);
        }
        return strikeCount;
    }).catch(err => {
        debug.error(`Error while incrementing invite strikes for ${message.author.username}` + err, `InviteListener`);
        return database.getInviteStrikes(message.guild.id, message.member.id);
    })
}
