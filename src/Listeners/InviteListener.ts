import {Message} from 'discord.js'
import {discordInviteRegex} from "./Regex";
import {debug} from '../Events/onMessage'
import {securityLevel, SecurityLevels} from "../Utility/Settings";
import safeDeleteMessage from "../Handlers/SafeDeleteMessage";
import safeMessageUser from "../Handlers/SafeMessageUser";
import {bannedForSpammingInvites} from "../Handlers/Replies";


export default function inviteListener(message : Message){
    const sender :string = message.member.nickname || message.author.username;
    if (message.content.match(discordInviteRegex)){
        debug.warning(`${sender} in ${message.guild} sent an invite link.`);

        if (securityLevel === SecurityLevels.Dangerous) return;
        safeDeleteMessage(message).then(()=> {
            debug.info(`Deleted invite link from ${sender}`);
            //safeMessageUser(message.author, bannedForSpammingInvites(message.guild), `spamming`);
        });
    }
}

