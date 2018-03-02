import * as Discord from 'discord.js'
import {getMuteDate, getMuteTime} from "../utility/Settings";
import {scheduleUnmute} from "./ScheduleUnmute";
import {debug, log} from "../utility/Logging";
import {DiscordAPIError} from "discord.js";
import {MuteQueue} from "./MuteQueue";

export async function muteUser(member : Discord.GuildMember, time : Date, queue : MuteQueue) {
    const memberName = member.nickname||member.user.username;
    const mutedRole : any = member.guild.roles.find('name', 'muted');

    if (!mutedRole)
        return debug.warning(`Spammer ${memberName} could not be muted, missing 'muted' role in server ${member.guild.name}.`, "MuteUser");

    try {
        await member.addRole(mutedRole, `Spamming`);
    } catch (err) {
        if (err instanceof DiscordAPIError){
            return debug.warning(`Could not mute spammer ${memberName}, missing permissions.`, "MuteUser")
        }
        else {
            debug.error(`Unexpected error while muting user ${memberName}\n` + err,  "MuteUser");
        }
    }
    const unmuteTime : Date = getMuteDate();
    let timeDelta : number = unmuteTime.getTime() - Date.now();

    log(member.guild,
        `[${memberName}] was muted for ${getMuteTime()} seconds for spamming.`);

    debug.warning(`[${memberName}] in ${member.guild.name} was muted for ${getMuteTime()} seconds.`, "MuteUser");
    queue.add(member, mutedRole, unmuteTime);
}