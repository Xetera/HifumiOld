import * as Discord from 'discord.js'
import {getMuteDuration} from "../Settings";
import {scheduleUnmute} from "./ScheduleUnmute";
import {debug, log} from "../Logging";
import {DiscordAPIError} from "discord.js";
import {MuteQueue} from "./MuteQueue";

export async function muteUser(member : Discord.GuildMember, time : Date, queue : MuteQueue) {
    const memberName = member.nickname||member.user.username;
    const mutedRole : any = member.guild.roles.find('name', 'muted');

    if (!mutedRole)
        return debug.warning(`Spammer ${memberName} could not be muted, missing 'muted' role in server ${member.guild.name}.`);

    try {
        await member.addRole(mutedRole, `Spamming`);
    } catch (err) {
        if (err instanceof DiscordAPIError){
            return debug.warning(`Could not mute spammer ${memberName}, missing permissions.`)
        }
        else {
            debug.error(`Unexpected error while unmuting`)
        }
    }
    const unmuteTime : Date = getMuteDuration();
    let timeDelta : number = unmuteTime.getMilliseconds() - Date.now();;


    log(member.guild,
        `[${memberName}] was muted for ${timeDelta/1000} seconds for spamming.`);

    debug.info(`[${memberName}] in ${member.guild.name} was muted for ${getMuteDuration()}`);
    queue.add(member, mutedRole, unmuteTime);
}