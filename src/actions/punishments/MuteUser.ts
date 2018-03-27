import {getMuteTime} from "../../utility/Settings";
import {DiscordAPIError, GuildMember, Role} from "discord.js";
import {debug, log} from "../../utility/Logging";
import gb from "../../misc/Globals";
import {LogManager} from "../../handlers/logging/logManager";
import muteDMEmbed from "../../embeds/moderation/muteDMEmbed";
import {Offense} from "../../moderation/interfaces";
import safeMessageUser from "../../handlers/safe/SafeMessageUser";

export default function muteUser(member: GuildMember, role: Role, reason: string, userMessage: string, logMessage?: boolean): boolean {
    if (member.hasPermission("ADMINISTRATOR")) {
        debug.warning(`Tried to mute ${member.displayName} for ${getMuteTime()} seconds but they are an administrator.`, "MuteQueue");
        return false;
    }

    else if(!member.guild.members.find('id', member.client.user.id).hasPermission("MANAGE_ROLES")){
        debug.warning(`Could not mute ${member.displayName}, missing manage roles permission.`);
        LogManager.logWarning(member.guild, `Could not mute ${member} for ${reason}, missing \`Manage Roles\` permission.`);
        return false;
    }

    member.addRole(role, reason).then(()=> {
        safeMessageUser(member, muteDMEmbed(member, Offense.Spam))
    }).catch(err =>{
        if (err instanceof DiscordAPIError){
            return debug.warning(`Could not mute spammer ${member.displayName}, missing permissions.`, "MuteQueue");
        }
        else {
            return debug.error(`Unexpected error while muting user ${member.displayName}\n` +err, "MuteQueue");
        }
    });

    debug.info(`${member.displayName} was muted for ${getMuteTime()}s`);
    // TODO: format s based time into nice intervals
    if (logMessage)
        LogManager.logMutedUser(member);
    return true;
}