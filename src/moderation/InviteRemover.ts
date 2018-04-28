import gb from "../misc/Globals";
import safeMessageUser from "../handlers/safe/SafeMessageUser";
import {Offense} from "./interfaces";
import safeDeleteMessage from "../handlers/safe/SafeDeleteMessage";
import {debug} from "../events/onMessage";
import banForInviteSpam from "../actions/punishments/BanForInviteSpam";
import {GuildMember, Message} from "discord.js";
import {LogManager} from "../handlers/logging/logManager";

export default function deleteInvite(message: Message, editedMessage: boolean = false): Promise<number> {
    const sender = message.author.username;
    const trackList = gb.instance.trackList;
    return safeDeleteMessage(message).then(()=> {
        debug.info(`Deleted invite link from ${sender}`);
        return gb.instance.database.incrementInviteStrike(message.member)
    }).then(async(strikeCount : number) => {
        debug.silly(`${message.member.displayName} has ` + strikeCount + " strikes on record", `InviteListener`);

        if (trackList.isNewMember(message.member)
            && await gb.instance.database.getTrackNewMembers(message.guild.id)
            && strikeCount > 1){

            debug.info(`Advertiser ${message.author.username} was a tracked member, attempting to ban...`, `InviteListener`);
            trackList.punishNewMember(message.member, Offense.InviteLink);
        }
        else if (strikeCount >= 5){
            banForInviteSpam(message.member);
        }
        else if (strikeCount === 4){
            safeMessageUser(message.member,
                `Warning: You've attempted to post 4 invites in ${message.guild.name}, the next one will get you banned.\n` +
                `I don't go advertising in your server, so please don't do that in mine.`);
        }
        if (!editedMessage){
            LogManager.logIllegalInvite(message);
        }
        return strikeCount;
    }).catch(err => {
        debug.error(`Error while incrementing invite strikes for ${message.author.username}` + err, `InviteListener`);
        return gb.instance.database.getInviteStrikes(message.guild.id, message.member.id);
    })
}
