import * as Discord from 'discord.js'
import {getMuteDuration} from "../Settings";
import {scheduleUnmute} from "./ScheduleUnmute";
import {debug, log} from "../Logging";
import {DiscordAPIError} from "discord.js";

export async function muteUser(member : Discord.GuildMember, time : number) {
    const memberName = member.nickname||member.user.username;
    const mutedRole : any = member.guild.roles.find('name', 'muted');

    if (!mutedRole)
        return debug.warning(`Spammer ${memberName} could not be muted, missing 'muted' role.`);

    try {
        await member.addRole(mutedRole);
    } catch (err) {
        if (err instanceof DiscordAPIError){
            return debug.warning(`Could not mute spammer ${memberName}, missing permissions.`)
        }
    }

    log(member.guild,
        `[${memberName}] was muted for ${getMuteDuration() / 1000} seconds for spamming.`);

    scheduleUnmute(member, time);
}