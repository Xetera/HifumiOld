import * as Discord from 'discord.js'
import * as dbg from "debug";
import {scheduleUnmute} from "./ScheduleUnmute";
import {DiscordAPIError} from "discord.js";
import {getMuteTime} from "../Utility/Settings";
import Timer = NodeJS.Timer;
import {log} from "../Utility/Logging";

const debug = {
    silly   : dbg('Bot:MuteQueue:Silly'),
    info    : dbg('Bot:MuteQueue:Info'),
    warning : dbg('Bot:MuteQueue:Warning'),
    error   : dbg('Bog:MuteQueue:Error')
};

class MutedUser  {
    member : Discord.GuildMember;
    muteQueue : MuteQueue;
    name : string;
    muteDate : Date;
    unmuteDate : Date;
    role : Discord.Role;
    unmuteSeconds ?: number;
    timeout ?: Timer;

    constructor(member : Discord.GuildMember, role : Discord.Role, unmuteDate : Date, muteQueue: MuteQueue){
        this.member = member;
        this.name = member.nickname || member.user.username; // this can change but we don't care
        this.muteDate = new Date();
        this.unmuteDate = unmuteDate;
        this.role = role;
        this.muteQueue = muteQueue;
        this.muteUser();
    }

    public muteUser(){
        if (this.member.hasPermission("ADMINISTRATOR"))
            return debug.warning(`Tried to mute ${this.name} for ${getMuteTime()} seconds but they are an administrator.`);

        try {
            this.member.addRole(this.role, `Spamming`);

        } catch (err) {
            if (err instanceof DiscordAPIError){
                return debug.warning(`Could not mute spammer ${this.name}, missing permissions.`);
            }
            else {
                return debug.error(`Unexpected error while muting user ${this.name}`, err);
            }
        }
        debug.info(`${this.name} was muted for ${getMuteTime()}s`);
        log(this.member.guild, `${this.name} was muted for ${getMuteTime()}s`)
    }
    public cancelUnmute(){
        if (this.timeout === undefined)
            return debug.error(`Could not cancel scheduled unmute for ${this.name}, user has no scheduled unmute date`);
        clearTimeout(this.timeout);
    }
}

export class MuteQueue {
    queue : MutedUser[];

    constructor(){
        this.queue = [];
        debug.info('MuteQueue is ready.');
    }

    public add(member : Discord.GuildMember, role : Discord.Role, unmuteDate : Date) : void {
        this.queue.push(new MutedUser(member, role, unmuteDate, this));
        if (this.queue.findIndex(mute => mute.member === member) !== -1)
            this.scheduleUnmute(member);
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

    public scheduleUnmute(user : Discord.GuildMember){
        let _this = this;
        let index : number = this.queue.findIndex((usr: MutedUser) =>
            usr.member.id === user.id
        );
        let mutedGuildMember : MutedUser = this.queue[index];
        if (mutedGuildMember === undefined) return debug.error('Tried to shift an empty MuteQueue.');

        let timeDelta : number = getMuteTime(); // in seconds

        debug.silly(`${timeDelta} seconds recorded as timeDelta for ${mutedGuildMember.name}`);

        const timeoutId : Timer = setTimeout(async function(){
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
                debug.error(`Unexpected error while unmuting ${mutedGuildMember.name}.`, error);
            }

            _this.queue.splice(index, 1);
            debug.info(`${mutedGuildMember.name} in ${mutedGuildMember.member.guild.name} was unmuted after ${timeDelta} seconds.`);

        }, timeDelta * 1000);

        mutedGuildMember.timeout = timeoutId;
    }
}