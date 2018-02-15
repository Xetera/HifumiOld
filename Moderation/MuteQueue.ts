import * as Discord from 'discord.js'
import {debug} from "../Logging";
import {scheduleUnmute} from "./ScheduleUnmute";
import {queryCallback} from "mysql";
import {taskqueue} from "googleapis/build/src/apis";
import {DiscordAPIError} from "discord.js";

class MutedUser  {
    member : Discord.GuildMember;
    name : string;
    muteDate : Date;
    unmuteDate : Date;
    role : Discord.Role;
    unmuteSeconds ?: number;
    constructor(member : Discord.GuildMember, role : Discord.Role, unmuteDate : Date){

        this.name = member.nickname || member.user.username; // this can change but we don't care
        this.muteDate = new Date();
        this.unmuteDate = unmuteDate;
        this.role = role;
    }
}

export class MuteQueue {
    queue : Array<MutedUser>;

    constructor(){
        this.queue  = [];
    }
    public add(user : Discord.GuildMember, role : Discord.Role, unmuteDate : Date) : void {
        this.queue.push(new MutedUser(user, role, unmuteDate));
        this.scheduleUnmute(user);
    }

    public getMutedUserCount() : number {
        return this.queue.length;
    }

    public release(...members: Discord.GuildMember[]) : void {
        let i = 0;
        let queueLength : number = members.length;
        do {
            let member = members[i];
            const index : number = this.queue.findIndex((user : MutedUser) => user.member.id === member.id);
            if (index > 0){ // user was not found in the muteQueue
                const releasedSpammer : MutedUser = this.queue.splice(index, 1)[0];
                member.removeRole(releasedSpammer.role, `The ${releasedSpammer.unmuteSeconds} timeout duration ran out.`)
            }
            else {
                debug.warning(`Could not release ${member.nickname||member.user.username}, not found in the muteQueue.`);
            }

            i++;
        }
        while (i < queueLength - 1); // length of 1 ===

    }

    private scheduleUnmute(user : Discord.GuildMember){
        let _this = this;
        let index : number = this.queue.findIndex((usr: MutedUser) => usr.member.id === user.id);
        let mutedGuildMember : MutedUser = this.queue[index];
        if (mutedGuildMember === undefined) return debug.error('Tried to shift an empty MuteQueue.');

        let timeDelta : number = mutedGuildMember.unmuteDate.getTime() - Date.now();

        debug.silly(`${timeDelta} seconds recorded as timeDelta for ${mutedGuildMember.name}`);

        setTimeout(async function(){
            // index could have changed by the time this is scheduled to run
            let index : number = _this.queue.findIndex((usr: MutedUser) => usr.member.id === user.id);
            if (!mutedGuildMember.role) {
                debug.warning(`Could not schedule an unmute for user ${mutedGuildMember.name}, missing 'muted' role.`);
                return _this.queue.splice(index, 1);
            }

            try {
                await mutedGuildMember.member.removeRole(mutedGuildMember.role, `End of ${timeDelta/1000} second mute.`);
            }
            catch (error) {
                if (error instanceof DiscordAPIError){
                    debug.error(`Tried to unmute ${mutedGuildMember.name} but they were already unmuted.`, error);
                    return _this.queue.splice(index, 1);
                }
            }
            _this.queue.splice(index, 1);
            debug.info(`${mutedGuildMember.name} in ${mutedGuildMember.member.guild.name} was unmuted after ${timeDelta} seconds of timeout.`);

        }, timeDelta);
    }

}