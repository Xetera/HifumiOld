import * as Discord from 'discord.js'
import {DiscordAPIError, Guild, GuildMember, User} from "discord.js";
import {getMuteTime, raidDetectionInterval} from "../utility/Settings";
import Timer = NodeJS.Timer;
import { debug} from "../utility/Logging";
import moment = require("moment");
import muteUser from "../actions/punishments/MuteUser";
import {gb} from "../misc/Globals";
import {formattedTimeString} from "../utility/Util";
import {Offense} from "./interfaces";
import unmuteDMEmbed from "../embeds/moderation/unmuteDMEmbed";


class MutedMember  {
    name : string;
    muteDate : Date;
    timeout ?: Timer;
    muted : boolean;

    constructor(public member : Discord.GuildMember,
                public mutedBy: GuildMember,
                public role : Discord.Role,
                public unmuteDate : Date,
                public reason: string,
                public duration: number,
                public muteQueue: MuteQueue){
        this.name = member.nickname || member.user.username; // this can change but we don't care
        this.muteDate = new Date();

        // we have to initialize this as true for a few seconds and set
        // it to false later in case we weren't able to mute them
        this.muted = true;
    }

    public muteUser(){
        // TODO: fix this seconds only thing
        return muteUser(this.member, this.mutedBy, this.role, this.reason, this.duration).then((result) => {
            const user = this.member.guild.members.find(user => user.id === this.member.id);
            if (user){
                this.muted = false;
            }
            return result;
        })
    }
    public cancelUnmute(){
        if (this.timeout === undefined)
            return void debug.error(`Could not cancel scheduled unmute for ${this.name}, user has no scheduled unmute date`, "MuteQueue");
        clearTimeout(this.timeout);
    }
}

export class MuteQueue {
    queue : Map<string, MutedMember[]>;
    //  group of raiders, currently not functioning
    raiders : Map<string, MutedMember[]>;
    constructor(){
        this.queue = new Map<string, MutedMember[]>();
        this.raiders = new Map<string, MutedMember[]>();
        debug.info('MuteQueue is ready.', "MuteQueue");
    }

    private sortGuild(guildId: string){
        const arr: MutedMember[] | undefined = this.queue.get(guildId);
        if (!arr){
            const guild = gb.bot.guilds.get(guildId);
            debug.error(`Tried to sort a guild not registered in the muteQueue\nName:${guild ? guild.name: 'unknown guild'}`);
            return;
        }
        // This will sort the users based on their unmute date with the ones that have shorter time
        // being closer to the end of the array
        this.queue.set(guildId, arr.sort((a: MutedMember, b:MutedMember) => {
            if (a.unmuteDate < b.unmuteDate){
                return 1;
            }
            return -1;
        }));
    }

    /**
     * Adds user to the muteQueue
     * @param {GuildMember} member
     * @param {GuildMember} mutedBy
     * @param {Date} unmuteDate
     * @param {string | Offense} reason
     * @param {number} duration - in seconds
     */
    public async add(member : GuildMember, mutedBy: GuildMember, unmuteDate : Date, reason: string | Offense, duration?: number) : Promise<boolean> {
        let guild : MutedMember[] | undefined = this.queue.get(member.guild.id);

        let role: Discord.Role | undefined;
        const savedRoleId = await gb.database.getMuteRole(member.guild.id);
        if (savedRoleId){
            role = member.guild.roles.get(savedRoleId);
        }
        else {
            role = member.guild.roles.find(r => r.name === 'muted');
        }
        //TODO: change this to return some sort of error
        if (!role){
            return false;
        }

        let mutedMember : MutedMember = new MutedMember(
            member, mutedBy, role, unmuteDate, reason, duration ? duration : getMuteTime(), this
        );

        if (guild !== undefined) {
            const existingUser: MutedMember | undefined = guild.find(muted=> muted.member.id === member.id);
            if (existingUser && existingUser.muted) {
                debug.info(`Tried to mute ${existingUser.member.user.username} but they were already muted`);
                return Promise.resolve(false);
            }
            // is false when we couldn't mute the user
            if (!mutedMember.muted) {
                debug.warning(`Could not mute user ${member.user.username}`);
                return Promise.resolve(false);
            }
            guild.push(mutedMember);
        }
        else {
            if (!mutedMember.muted){
                debug.warning(`Could not mute user ${member.user.username}`);
                return Promise.resolve(false);
            }

            this.queue.set(member.guild.id, [mutedMember]);
            guild = this.queue.get(member.guild.id)!;
        }

        return mutedMember.muteUser().then(result => {
            if (guild!.length > 1)
                this.sortGuild(member.guild.id);
            if (result){
                gb.messageQueue.removeUsersRecentMessages(member);
                gb.database.addMutedUser(member.guild.id, member.id, unmuteDate);
                this.scheduleUnmute(member, reason, duration);
                return true;
            }
            return false;
        });
    }

    public getMutedUsers(guild: Guild){
        const targetGuild: MutedMember[] | undefined = this.queue.get(guild.id);
        if (!targetGuild){
            return undefined;
        }
        let out = '';
        for (let user in  targetGuild){
            out += `${targetGuild[user].name}: ${targetGuild[user].muteDate}`;
        }
        if (out === ''){
            out = `No users muted`;
        }
        return out;
    }

    public getMutedUserCount(guild : Discord.Guild) : number {
        const members : MutedMember[] | undefined = this.queue.get(guild.id);
        if (members !== undefined)
            return members.length;
        else
            return 0;
    }

    public insertNewGuild(guild : Discord.Guild){
        if (this.queue.get(guild.id) === undefined){
            this.queue.set(guild.id, []);
        }
    }

    public release(members: GuildMember | GuildMember[]) : void {
        if (!Array.isArray(members))
            members = [members];

        for (let i = members.length; i > 0; --i){
            const guild = this.queue.get(members[i].guild.id);
            if (!guild) {
                debug.info(`User ${members[i].user.username} in MuteQueue could not be found`);
                continue;
            }
            const targetId = members[i].id;
            guild.splice(guild.findIndex(muted => muted.member.id === targetId), 1);
        }
    }

    public getUser(guild: Guild, member:GuildMember|User): MutedMember | undefined {
        const targetGuild = this.queue.get(guild.id);
        if (!targetGuild)
            return undefined;
        return targetGuild.find(muted => muted.member.id === member.id);
    }

    public detectRaid(member: Discord.GuildMember){
        const members : MutedMember[] | undefined  =this.queue.get(member.guild.id);
        if (members === undefined) return;

        //const raidStatus = Database.getRaids
        const muteDates = members.map((user : MutedMember) => user.muteDate);
        const recentlyMuted : Date[] = muteDates.filter((date : Date)=>
            date > moment(date).subtract(raidDetectionInterval).toDate()
        );
        if (recentlyMuted.length > 5){
            //raidMode()
        }
    }

    public scheduleUnmute(member : Discord.GuildMember, reason: string | Offense, duration?: number){
        const members : MutedMember[] | undefined  =this.queue.get(member.guild.id);

        if (members === undefined)
            return void debug.warning(`Guild for ${member.nickname} was not found`, 'MuteQueue');

        const mutedGuildMember: MutedMember | undefined = members.pop();

        if (!mutedGuildMember)
            return void debug.error(`Tried fetching a member from the empty muteQueue of ${member.guild.name}`, 'muteQueue');

        // in seconds
        let timeDelta : number = duration ? duration : getMuteTime();
        const timeFormat = formattedTimeString(timeDelta);

        debug.silly(`${timeFormat} recorded as timeDelta for ${mutedGuildMember.name}`);

        const timeoutId : Timer = setTimeout(() => {
            // index could have changed by the time this is scheduled to run
            const timeoutMembers : MutedMember[] | undefined  = this.queue.get(member.guild.id);

            if (!timeoutMembers)
                return;
            else if (!mutedGuildMember.role || !mutedGuildMember.member.roles.has(mutedGuildMember.role.id)) {
                return void debug.warning(`Tried to unmute ${mutedGuildMember.name} but they were already unmuted.\n`, "MuteQueue");
            }
            const target = mutedGuildMember.member;
            target.removeRole(mutedGuildMember.role, `End of ${timeFormat} mute.`)
                .then(() => {
                    debug.info(`${mutedGuildMember.name} in ${mutedGuildMember.member.guild.name} was unmuted after ${timeFormat}.`, "MuteQueue");
                    target.send(unmuteDMEmbed(target, reason, timeFormat));
                })
                .catch((error: Error) => {
                if (error instanceof DiscordAPIError){
                    return void debug.error(`Tried to unmute ${mutedGuildMember.name} but they were already unmuted.\n` + error, "MuteQueue");
                }
                return void debug.error(`Unexpected error while unmuting ${mutedGuildMember.name}.` + error, 'MuteQueue');
            });
        }, timeDelta * 1000);

        mutedGuildMember.timeout = timeoutId;
    }

    // public clearRaiders(message: Discord.Message) {
    //     const guild = message.guild;
    //     const raidGuild: MutedMember[] | undefined= this.queue.get(guild.id);
    //     if (!raidGuild)
    //         return void debug.error(`No guild found for ${message.guild.name}`, 'muteQueue');
    //     const youTried = gb.emojis.get('hifumi_you_tried');
    //     const raiderCount = raidGuild.length;
    //
    //     if (!raidGuild)
    //         return void debug.error(`Tried clearing raiders in an non - existent guild ${guild.name}.`);
    //
    //     for (let i = raidGuild.length; i > 0; --i){
    //         const raider = raidGuild[i];
    //         if (raider.member.hasPermission('ADMINISTRATOR')){
    //             debug.warning(`Tried to autoban an admin for raiding in ${guild.name}`);
    //             continue;
    //             // TODO: Post a warning in the warning channel for this later
    //         }
    //         safeBanUser(raider.member,
    //             `Mass banned by ${message.author.username}`,
    //             `You were mass banned by a mod for raiding ${youTried}\n${advertiseOnBan}`);
    //         raidGuild.splice(i, 1);
    //
    //         // we also need to remove them from the Database when we implement that
    //     }
    //     message.channel.send(`Banned ${raiderCount - raidGuild.length} muted raiders. ${youTried}`)
    // }

    public crossCheckMutes(){

    }
}
