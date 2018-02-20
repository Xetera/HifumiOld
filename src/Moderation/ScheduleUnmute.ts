import * as Discord from 'discord.js'
import {debug}from '../../Logging'

export function scheduleUnmute(member : Discord.GuildMember, time: number){
    const mutedMemberName : string = member.nickname || member.user.username;
    const muted : any = member.guild.roles.find('name', 'muted');



}
