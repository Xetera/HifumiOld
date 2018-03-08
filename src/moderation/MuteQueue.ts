import * as Discord from 'discord.js'
import * as dbg from "debug";
import {DiscordAPIError} from "discord.js";
import {getMuteTime, raidDetectionInterval} from "../utility/Settings";
import Timer = NodeJS.Timer;
import {log, debug} from "../utility/Logging";
import {Moment} from "moment";
import moment = require("moment");
import {changeLockdownStatus} from "../database/PreparedStatements";
import raidMode from "../actions/RaidMode";
import {Database} from "../database/Database";
import muteUser from "../actions/MuteUser";
import safeBanUser from "../handlers/safe/SafeBanUser";
import gb from "../misc/Globals";
import {advertiseOnRaidBan} from "../handlers/Replies";


class MutedMember  {
    member : Discord.GuildMember;
    muteQueue : MuteQueue;
    name : string;
    muteDate : Date;
    unmuteDate : Date;
    role : Discord.Role;
    unmuteSeconds ?: number;
    timeout ?: Timer;
    muted : boolean;

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
        // TODO: fix this seconds only thing
        this.muted = muteUser(this.member, this.role,
            'Spamming',
            `You were muted in ${this.member.guild.name} for ${getMuteTime()} seconds for spamming.`,
            `Muted @${this.name} for ${getMuteTime()} seconds for spamming.`)
    }
    public cancelUnmute(){
        if (this.timeout === undefined)
            return debug.error(`Could not cancel scheduled unmute for ${this.name}, user has no scheduled unmute date`, "MuteQueue");
        clearTimeout(this.timeout);
    }
}

export class MuteQueue {
    queue : Map<string, MutedMember[]>;
    raiders : Map<string, MutedMember[]>;
    database : Database;
    constructor(database : Database){
        this.queue = new Map<string, MutedMember[]>();
        this.raiders = new Map<string, MutedMember[]>();
        this.database = database;
        debug.info('MuteQueue is ready.', "MuteQueue");
    }

    public add(member : Discord.GuildMember, role : Discord.Role, unmuteDate : Date) : void {
        let mutedMember : MutedMember = new MutedMember(member, role, unmuteDate, this);
        let guild : MutedMember[] | undefined = this.queue.get(member.guild.id);
        if (!mutedMember.muted) return;

        if (guild !== undefined)
            guild.push(mutedMember);
        else
            this.queue.set(member.guild.id, [mutedMember]);

        this.scheduleUnmute(member);
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
    public release(...members: Discord.GuildMember[]) : void {

    }

    public detectRaid(member: Discord.GuildMember){
        const members : MutedMember[] | undefined  =this.queue.get(member.guild.id);
        if (members === undefined) return;

        //const raidStatus = database.getRaids
        const muteDates = members.map((user : MutedMember) => user.muteDate);
        const recentlyMuted : Date[] = muteDates.filter((date : Date)=>
            date > moment(date).subtract(raidDetectionInterval).toDate()
        );
        if (recentlyMuted.length > 5){
            //raidMode()
        }
    }

    public scheduleUnmute(member : Discord.GuildMember){
        let _this = this;
        const members : MutedMember[] | undefined  =this.queue.get(member.guild.id);
        if (members === undefined) return debug.warning(`Guild for ${member.nickname} was not found`, 'MuteQueue');
        let index : number = members.findIndex((usr: MutedMember) =>
            usr.member.id === member.id
        );
        let mutedGuildMember : MutedMember = members[index];
        if (mutedGuildMember === undefined) return debug.error('Tried to shift an empty MuteQueue.', "MuteQueue");

        let timeDelta : number = getMuteTime(); // in seconds

        debug.silly(`${timeDelta} seconds recorded as timeDelta for ${mutedGuildMember.name}`);

        const timeoutId : Timer = setTimeout(async function(){
            // index could have changed by the time this is scheduled to run
            const timeoutMembers : MutedMember[] | undefined  = _this.queue.get(member.guild.id);
            if (timeoutMembers === undefined) return;

            let index : number = timeoutMembers.findIndex((usr: MutedMember) => usr.member.id === member.id);

            if (!mutedGuildMember.role) {
                debug.warning(`Tried to unmute ${mutedGuildMember.name} but they were already unmuted.\n`, "MuteQueue");
                return timeoutMembers.splice(index, 1);
            }

            try {
                await mutedGuildMember.member.removeRole(mutedGuildMember.role, `End of ${timeDelta/1000} second mute.`);
            }
            catch (error) {
                if (error instanceof DiscordAPIError){
                    debug.error(`Tried to unmute ${mutedGuildMember.name} but they were already unmuted.\n` + error, "MuteQueue");
                    return timeoutMembers.splice(index, 1);
                }
                debug.error(`Unexpected error while unmuting ${mutedGuildMember.name}.`, error);
            }
            timeoutMembers.splice(index, 1);
            debug.info(`${mutedGuildMember.name} in ${mutedGuildMember.member.guild.name} was unmuted after ${timeDelta} seconds.`, "MuteQueue");
        }, timeDelta * 1000);

        mutedGuildMember.timeout = timeoutId;
    }

    public clearRaiders(message: Discord.Message) {
        const guild = message.guild;
        const raidGuild = this.queue.get(guild.id);
        const youTried = gb.emojis.get('alexa_you_tried');
        const raiderCount = raidGuild.length;

        if (!raidGuild)
            return debug.error(`Tried clearing raiders in an non - existent guild ${guild.name}.`);

        for (let i = raidGuild.length; i > 0; --i){
            const raider = raidGuild[i];
            if (raider.member.hasPermission('ADMINISTRATOR')){
                debug.warning(`Tried to autoban an admin for raiding in ${guild.name}`);
                continue;
                // TODO: Post a warning in the warning channel for this later
            }
            safeBanUser(raider.member,
                `Mass banned by ${message.author.username}`,
                `You were mass banned by a mod for raiding ${youTried}\n${advertiseOnRaidBan}`);
            raidGuild.splice(i, 1);

            // we also need to remove them from the database when we implement that
        }
        message.channel.send(`Banned ${raiderCount - raidGuild.length} muted raiders. ${youTried}`)

    }
}