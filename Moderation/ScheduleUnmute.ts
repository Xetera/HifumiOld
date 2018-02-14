import * as Discord from 'discord.js'
import {debug}from './../Logging'

export function scheduleUnmute(member : Discord.GuildMember, time: number){
    const muted : any = member.guild.roles.find('name', 'muted');
    if (!muted)
        return debug.warning(`Could not schedule unmute for user ${member.user.username}, missing 'muted' role.`);

    setTimeout(function(){
        member.removeRole(muted);
    }, time);
}