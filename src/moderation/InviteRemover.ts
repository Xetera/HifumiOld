import {gb} from "../misc/Globals";
import safeMessageUser from "../handlers/safe/SafeMessageUser";
import {Offense} from "./interfaces";
import safeDeleteMessage from "../handlers/safe/SafeDeleteMessage";
import banForInviteSpam from "../actions/punishments/BanForInviteSpam";
import { Message} from "discord.js";
import {LogManager} from "../handlers/logging/logManager";
import inviteWarningDMEmbed from "../embeds/moderation/inviteWarningDM";
import {APIErrors} from "../interfaces/Errors";
import {incrementStat} from "../handlers/logging/datadog";
import {debug} from "../utility/Logging";

export default function deleteInvite(message: Message, editedMessage: boolean = false): Promise<number> {
    const sender = message.author.username;
    const trackList = gb.trackList;
    if (!message.guild.me.hasPermission('MANAGE_MESSAGES')){
       return Promise.reject(new Error(APIErrors.MISSING_PERMISSIONS));
    }
    return safeDeleteMessage(message).then(()=> {
        debug.info(`Deleted invite link from ${sender}`);
        incrementStat(`hifumi.moderation.invites.removed`);
        return gb.database.incrementInviteStrike(message.member)
    }).then(async(strikeCount : number) => {
        debug.silly(`${message.member.displayName} has ${strikeCount} strikes on record`);

        if (trackList.isNewMember(message.member)
            && await gb.database.getTrackNewMembers(message.guild.id)
            && strikeCount > 2){

            debug.info(`Advertiser ${message.author.username} was a tracked member, attempting to ban...`);
            trackList.punishNewMember(message.member, Offense.InviteLink);
        }
        else if (strikeCount >= await gb.database.getInviteBanThreshold(message.guild.id)){
            await banForInviteSpam(message.member);
        }
        else if (strikeCount === await gb.database.getInviteWarnThreshold(message.guild.id)){
            safeMessageUser(message.member, await inviteWarningDMEmbed(message.guild));
        }
        if (!editedMessage){
            LogManager.logIllegalInvite(message);
        }
        return strikeCount;
    }).catch(err => {
        debug.error(`Error while incrementing invite strikes for ${message.author.username}` + err, `InviteListener`);
        return gb.database.getInviteStrikes(message.guild.id, message.member.id);
    })
}
