import {Message} from 'discord.js'
import {discordInviteRegex} from "./Regex";
import {securityLevel, SecurityLevels} from "../utility/Settings";
import {gb} from "../misc/Globals";
import deleteInvite from "../moderation/InviteRemover";
import {debug} from "../utility/Logging";
import {incrementStat} from "../handlers/logging/datadog";

export default async function inviteListener(message: Message){
    const sentInvites: RegExpMatchArray | null = message.content.match(discordInviteRegex);
    if (!sentInvites
        || !message.guild.me.hasPermission('BAN_MEMBERS')
        || !sentInvites.length
        || securityLevel === SecurityLevels.Dangerous
        || message.member.hasPermission('BAN_MEMBERS')
        || message.author.id === gb.ownerID
        || await gb.database.getAllowGuildInvites(message.guild.id)) {
        return;
    }

    const guildInviteCollection = await message.guild.fetchInvites();
    const guildInvites = guildInviteCollection.array();

    const valid = sentInvites.every(i => {
        // for every invite that was sent
        const url = i.split('/');
        const code = url.pop();
        // make sure that at least ONE matches
        // a URL that belongs to the current server
        return guildInvites.some(i => {
            const url = i.url.split('/');
            return url.pop() === code;
        });
    });

    if (valid)
        return;

    debug.warning(`${message.author.username} in ${message.guild} sent an invite link.`);
    incrementStat(`hifumi.moderation.invites.seen`)
    return deleteInvite(message)
}

