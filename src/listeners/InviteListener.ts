import {Message} from 'discord.js'
import {discordInviteRegex} from "./Regex";
import {debug} from '../events/onMessage'
import {securityLevel, SecurityLevels} from "../utility/Settings";
import safeDeleteMessage from "../handlers/safe/SafeDeleteMessage";
import {Database} from "../database/Database";
import banForInviteSpam from "../actions/punishments/BanForInviteSpam";
import safeMessageUser from "../handlers/safe/SafeMessageUser";
import gb from "../misc/Globals";
import Watchlist from "../moderation/Tracklist";
import {Offense} from "../moderation/interfaces";
import deleteInvite from "../moderation/InviteRemover";

export default async function inviteListener(message : Message, database : Database){
    if (message.author.id === gb.ownerID || message.member.hasPermission('BAN_MEMBERS'))
        return; // heh
    const sender :string = message.member.nickname || message.author.username;
    //TODO: Add telegram and whatsapp links in here as optional as well
    if (!message.content.match(discordInviteRegex) || await gb.instance.database.getAllowGuildInvites(message.guild.id)) {
        return;
    }
    debug.warning(`${sender} in ${message.guild} sent an invite link.`, `InviteListener`);

    if (securityLevel === SecurityLevels.Dangerous) return;

    deleteInvite(message)
}

