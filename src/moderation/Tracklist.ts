import * as Discord from 'discord.js'
import { getMemberTrackDuration, securityLevel, SecurityLevels} from "../utility/Settings";
import {gb} from "../misc/Globals";
import {Guild, GuildMember, Message} from "discord.js";
import {Offense} from "./interfaces";
import banTrackedUserForInvite from "../actions/punishments/tracklist/BanTrackedUserForInvite";
import banTrackedUserForSpam from "../actions/punishments/tracklist/banTrackedUserForSpam";
import {debug} from '../utility/Logging';

type guildId = string;

interface TrackedMember extends GuildMember {
    security : SecurityLevels;
    join_date: Date;
    banned: boolean;
}



export default class Tracklist {
    members : Map<guildId, TrackedMember[]>;
    trackedMessages: Map<guildId, Message[]>;

    constructor(){
        this.trackedMessages = new Map<guildId, Message[]>();
        this.members = new Map<guildId, TrackedMember[]>();
    }

    // called on startup
    public initializeGuilds(){
        const guildIds = gb.bot.guilds.map(guild => guild.id);
        for (let i in guildIds){
            this.members.set(guildIds[i], []);
        }
    }

    public insertNewGuild(guild: Guild){
        this.members.set(guild.id, []);
    }

    public getMember(member: Discord.GuildMember) : TrackedMember | undefined {
        const members = this.members.get(member.guild.id)!;
        return members.find(cached => cached.id === member.id);
    }

    public getAllMembers(){
        let out = '';
        this.members.forEach((value, key) => {
            out += `${gb.bot.guilds.get(key)!.name}: ${value.join(', ')} \n`;
        });
        return out;
    }

    public async add(member: Discord.GuildMember){
        if (!await gb.database.getTrackNewMembers(member.guild.id)){
            return;
        }

        const trackDuration = getMemberTrackDuration();

        if (!trackDuration)
            return;

        let trackedUser: TrackedMember  = <TrackedMember> member;
        trackedUser.join_date = new Date();
        trackedUser.security = securityLevel;
        let members = this.members.get(member.guild.id);

        if (members === undefined) {
            this.members.set(member.guild.id, [trackedUser]);
            return;
        }
        const existingMember:  TrackedMember | undefined = members.find(tracked => tracked.id === member.id);

        if (existingMember) {
            existingMember.join_date = trackedUser.join_date;
            return void debug.info(`User ${member.user.username} rejoined`)
        }

        members.push(trackedUser);
        setTimeout(() => this.remove(trackedUser), trackDuration * 1000);
    }


    // this really shouldn't be something that's public but still
    public remove(member: GuildMember){
        const guild = this.members.get(member.guild.id)!;
        const trackedMember: number = guild.findIndex(tracked => tracked.id === member.id);

        if (trackedMember === -1){
            return void debug.error(`Tried to remove ${member.user.username} from the tracklist but they were not found`);
        }

        guild.splice(trackedMember, 1);
        debug.info(`Member ${member.user.username} in guild ${member.guild.name} was removed from the tracklist.`);
    }

    public isNewMember(member: TrackedMember|GuildMember): boolean {
        let trackedMembers: TrackedMember[] = this.members.get(member.guild.id)!;
        let trackedMember: TrackedMember | undefined = trackedMembers.find(tracked => tracked.id === member.id);

        return Boolean(trackedMember);
    }

    public punishNewMember(member: GuildMember, offense: Offense){
        const tracked: TrackedMember | undefined = this.getMember(member);
        if (!tracked)
            return void debug.error(
                `Tried punishing new member '${member.user.username}' in '${member.guild.name}' but they are not tracked.`
            );
        else if (tracked.banned)
            return void debug.silly(`User ${member.user.username} is already banned`);

        tracked.banned = true;
        if (offense === Offense.Spam){
            banTrackedUserForSpam(member);
        }
        else if (offense === Offense.InviteLink){
            banTrackedUserForInvite(member);
        }
    }

    // Placeholder, fixed in earlier merges
}
