import {Message} from 'discord.js'
import {discordInviteRegex} from "./Regex";
import {debug} from '../Events/onMessage'
import {securityLevel, SecurityLevels} from "../Utility/Settings";
import safeDeleteMessage from "../Handlers/SafeDeleteMessage";
import {Database} from "../Database/Database";
import banForInviteSpam from "../Actions/BanForInviteSpam";

export default function inviteListener(message : Message, database : Database){
    const sender :string = message.member.nickname || message.author.username;
    if (message.content.match(discordInviteRegex)){
        debug.warning(`${sender} in ${message.guild} sent an invite link.`);

        if (securityLevel === SecurityLevels.Dangerous) return;
        safeDeleteMessage(message).then(()=> {
            debug.info(`Deleted invite link from ${sender}`);
            return database.incrementMemberInviteStrikes(message.member)
        }).then((strikeCount : number) => {
            debug.silly(strikeCount + " strikes on record");
            // hardcoding but we shouldn't really need to change this for anything
            if (strikeCount >= 5){
                banForInviteSpam(message.member);
            }
        })
    }
}

