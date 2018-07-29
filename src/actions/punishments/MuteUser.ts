import {getMuteTime} from "../../utility/Settings";
import {DiscordAPIError, GuildMember, Role} from "discord.js";
import {debug} from "../../utility/Logging";
import {LogManager} from "../../handlers/logging/logManager";
import muteDMEmbed from "../../embeds/moderation/muteDMEmbed";
import {Offense} from "../../moderation/interfaces";
import safeMessageUser from "../../handlers/safe/SafeMessageUser";
import {formattedTimeString} from "../../utility/Util";

/**
 * Mutes the user permanently.
 * Use the MuteQueue to temporarily mute users instead.
 * @param {GuildMember} member
 * @param {Role} role - The mute Role to be added
 * @param {string | Offense} reason - Reason to be displayed to the user and logged
 * @param {number} duration - Duration IN SECONDS
 * @param {boolean} logMessage - Whether to log the message or not
 * @returns {Promise<boolean>}
 */
export default function muteUser(member: GuildMember, mutedBy: GuildMember, role: Role, reason: string | Offense, duration: number): Promise<boolean> {
    if (member.hasPermission("ADMINISTRATOR")) {
        debug.warning(`Tried to mute ${member.displayName} for ${formattedTimeString(getMuteTime())} but they are an administrator.`);
        return Promise.resolve(false);
    }

    else if (!member.guild.me.hasPermission("MANAGE_ROLES")){
        debug.warning(`Could not mute ${member.displayName}, missing manage roles permission.`);
        // TODO: setup warnings channel
        /*LogManager.logWarning(
            member.guild,
            `Could not mute ${member} for ${reason}, missing \`Manage Roles\` permission.`);
        */
        return Promise.resolve(false);
    }
    return member.addRole(role, reason).then(()=> {
        safeMessageUser(member, muteDMEmbed(member, reason, duration)).catch((err) => Promise.reject(err));
        LogManager.logMutedUser(member, mutedBy, reason, duration);
        debug.info(`${member.displayName} was muted for ${formattedTimeString(getMuteTime())}`);
        return true;
    }).catch(err =>{
        if (err instanceof DiscordAPIError){
            //TODO: add missing permission embed
            debug.warning(`Could not mute user ${member.displayName}, missing permissions.`);
        }
        else {
            debug.error(`Unexpected error while muting user ${member.displayName}\n` + err.stack, "MuteQueue");
        }
        return false;
    });
}
