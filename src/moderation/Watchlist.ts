import * as Discord from 'discord.js'
import {getMemberTrackDuration, securityLevel, SecurityLevels} from "../utility/Settings";
import {MessageQueue} from "./MessageQueue";
import {Instance} from "../misc/Globals";
import {Guild, GuildMember} from "discord.js";
import {runInThisContext} from "vm";
import {Offense} from "./interfaces";
import banTrackedUserForInvite from "../actions/punishments/watchlist/BanTrackedUserForInvite";
import banTrackedUserForSpam from "../actions/punishments/watchlist/banTrackedUserForSpam";
import {debug} from '../utility/Logging';

type guildId = string;
type userId = string;

interface TrackedMember extends Discord.GuildMember {
    security : SecurityLevels;
    join_date: Date;
}

function isTrackedMember(member: any): member is TrackedMember {
    return 'join_date' in member;
}


export default class Watchlist {
    private members : Map<guildId, TrackedMember[]>;
    private trackedMessages: Map<guildId, Discord.Message[]>;


    constructor(){
        this.trackedMessages = new Map<guildId, Discord.Message[]>();
        this.members = new Map<guildId, TrackedMember[]>();
    }

    public getMember(member: Discord.GuildMember) : TrackedMember | undefined {
        const members = this.members.get(member.guild.id);
        if (members === undefined)
            return undefined;
        else
            return members.find(cached => cached.id === member.id);
    }

    private messageRepetitionDetected(){}

    public add(member : Discord.GuildMember){
        let trackedUser : TrackedMember  = <TrackedMember> member;
        trackedUser.join_date = new Date();
        trackedUser.security = securityLevel;
        let members = this.members.get(member.guild.id);
        if (members === undefined)
            this.members.set(member.guild.id, [trackedUser]);
        else
            members.push(trackedUser);
    }

    public isNewMember(member: TrackedMember|GuildMember): boolean {
        let target: TrackedMember | undefined;
        if (isTrackedMember(member)){
            target = this.getMember(member)
        }
        else {
            target = <TrackedMember> member;
            target.join_date = new Date();
        }
        if (!target){
            debug.error(`Member ${member.user.username} was not found in the WatchList`, 'WatchList');
            return false;
        }
        const duration: Date | undefined = getMemberTrackDuration();
        if (duration)
            return target.join_date < duration;
        return false;
    }

    public auditMember(message : Discord.Message){
        // user is not being tracked
        const member = this.getMember(message.member);
        //const trackedGuild
        if (member === undefined) return;
    }

    public punishNewMember(member: GuildMember, offense: Offense){
        if (offense === Offense.Spam){
            banTrackedUserForSpam(member);
        }
        else if (offense === Offense.InviteLink){
            banTrackedUserForInvite(member);
        }
    }



    public detectPreRaid()  {
        // when an unusual number of people join, elevate detection
        // lower spam threshold and compare messages from new users to check for spam
    }
}