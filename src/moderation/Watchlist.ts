import * as Discord from 'discord.js'
import {securityLevel, SecurityLevels} from "../utility/Settings";
import {MessageQueue} from "./MessageQueue";
import {Instance} from "../misc/Globals";
type guildId = string;
type userId = string;

interface TrackedMember extends Discord.GuildMember {
    security : SecurityLevels;
    join_date: Date;
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

    public auditMember(message : Discord.Message){
        // user is not being tracked
        const member = this.getMember(message.member);
        //const trackedGuild
        if (member === undefined) return;
        //if ()
    }


    public detectPreRaid()  {
        // when an unusual number of people join, elevate detection
        // lower spam threshold and compare messages from new users to check for spam
    }
}