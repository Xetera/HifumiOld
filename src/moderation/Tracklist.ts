import { getMemberTrackDuration, securityLevel} from "../utility/Settings";
import {Guild, GuildMember, Message} from "discord.js";
import {Offense} from "./interfaces";
import banTrackedUserForInvite from "../actions/punishments/tracklist/BanTrackedUserForInvite";
import banTrackedUserForSpam from "../actions/punishments/tracklist/banTrackedUserForSpam";
import {debug} from '../utility/Logging';
import {guildId, ITracklist, TrackedMember} from "../interfaces/injectables/tracklist.interface";
import {IClient} from "../interfaces/injectables/client.interface";
import {Inject} from "typescript-ioc";
import {IDatabase} from "../interfaces/injectables/datbase.interface";

export default class Tracklist extends ITracklist {
    members: Map<guildId, TrackedMember[]>;
    trackedMessages: Map<guildId, Message[]>;
    @Inject client: IClient;
    @Inject database: IDatabase;
    constructor(){
        super();
        this.trackedMessages = new Map<guildId, Message[]>();
        this.members = new Map<guildId, TrackedMember[]>();
    }

    // called on startup
    public initializeGuilds(){
        const guildIds = this.client.guilds.map(guild => guild.id);
        for (let i in guildIds){
            this.members.set(guildIds[i], []);
        }
    }

    public insertNewGuild(guild: Guild){
        this.members.set(guild.id, []);
    }

    public getMember(member: GuildMember) : TrackedMember | undefined {
        const members = this.members.get(member.guild.id)!;
        return members.find(cached => cached.id === member.id);
    }

    public async add(member: GuildMember){
        if (!await this.database.getGuildColumn(member.guild.id, 'tracking_new_members')){
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
            return void debug.error(`Tried to remove ${member.user.username} from the tracklist but they were not found`, 'Tracklist');
        }

        guild.splice(trackedMember, 1);
        debug.info(`Member ${member.user.username} in guild ${member.guild.name} was removed from the tracklist.`, 'Tracklist');
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
