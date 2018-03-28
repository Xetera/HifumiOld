import {getMuteTime} from "../../utility/Settings";
import {DiscordAPIError, GuildMember, Role} from "discord.js";
import {debug, log} from "../../utility/Logging";
import gb from "../../misc/Globals";
import {LogManager} from "../../handlers/logging/logManager";
import muteDMEmbed from "../../embeds/moderation/muteDMEmbed";
import {Offense} from "../../moderation/interfaces";
import safeMessageUser from "../../handlers/safe/SafeMessageUser";
import {formattedTimeString} from "../../utility/Util";

export default function muteUser(member: GuildMember, role: Role, reason: string | Offense, logMessage?: boolean): Promise<boolean> {
    if (member.hasPermission("ADMINISTRATOR")) {
        debug.warning(`Tried to mute ${member.displayName} for ${getMuteTime()} seconds but they are an administrator.`, "MuteQueue");
        return Promise.resolve(false);
    }

    else if (!member.guild.members.find('id', member.client.user.id).hasPermission("MANAGE_ROLES")){
        debug.warning(`Could not mute ${member.displayName}, missing manage roles permission.`);
        LogManager.logWarning(
            member.guild,
            `Could not mute ${member} for ${reason}, missing \`Manage Roles\` permission.`);
        return Promise.resolve(false);
    }

    return member.addRole(role, reason).then(()=> {
        return safeMessageUser(member, muteDMEmbed(member, Offense.Spam))
    }).then(() => {
        debug.info(`${member.displayName} was muted for ${formattedTimeString(getMuteTime())}`);
        if (logMessage)
            LogManager.logMutedUser(member);
        return true;
    }).catch(err =>{
        if (err instanceof DiscordAPIError){
            //TODO: add missing permission embed
            debug.warning(`Could not mute spammer ${member.displayName}, missing permissions.`, "MuteQueue");
        }
        else {
            debug.error(`Unexpected error while muting user ${member.displayName}\n` +err, "MuteQueue");
        }
        return false;
    });
}