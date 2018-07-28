import * as Discord from "discord.js";
import * as moment from "moment";

import {MuteQueue} from "./MuteQueue";
import {
     getMuteDate, getSpamTolerance,
} from "../utility/Settings";
import {debug} from '../utility/Logging'
import {Database} from "../database/Database";
import Tracklist from "./Tracklist";
import {gb} from "../misc/Globals";
import {Offense} from "./interfaces";
import { GuildMember,} from "discord.js";
import safeBulkDelete from "../handlers/safe/safeBulkDelete";

interface CachedMessage extends Discord.Message {
    sent : Date;
}

export class MessageQueue {
    queue : Map<string, CachedMessage[]>;
    trackList: Tracklist;
    bufferLength : number;
    muteQueue : MuteQueue;
    db : Database;
    constructor(muteQueue : MuteQueue, database: Database, watchlist: Tracklist, size ?: number){
        this.muteQueue = muteQueue;
        this.db = database;
        this.queue = new Map<string, CachedMessage[]>();
        this.trackList = watchlist;
        this.bufferLength = size ? size : 200;
        debug.info('MessageQueue is ready.', "MessageQueue");
    }

    public add(msg: CachedMessage) : void {
        const self = this;

        msg.sent = moment(new Date()).toDate();
        const guild : CachedMessage[] | undefined = this.queue.get(msg.guild.id);
        if (guild === undefined){
            this.queue.set(msg.guild.id, [msg]);
        }
        else {
            guild.push(msg);
        }

        this.queue.forEach(function(value){
            //  value.length => length of messages stored in the message queue
            if (value.length > self.bufferLength){
                const guildName = msg.guild.name;
                const temp : CachedMessage | undefined = value.shift();
                if (temp === undefined)
                    debug.error(`Tried to shift out an empty message from ${guildName}'s messageQueue` +
                        `\nMost likely because buffer length is 0 or undefined.`, "MessageQueue");
            }
        });
        this.checkForSpam(msg.member);
    }

    //gets called every message
    private async checkForSpam(member : Discord.GuildMember) {
        const spamMessages : CachedMessage[] | void = this.getRecentUserMessages(member);
        if (!spamMessages) return;

        if (spamMessages == null) return;
        const isUserSpamming : boolean = spamMessages.length >= getSpamTolerance();

        if (isUserSpamming){
            // checking if the user is new before punishing
            const spamFilter = await gb.database.getSpamFilter(member.guild.id);
            if (!spamFilter){
                return;
            }
            const watchlist = gb.trackList;
            if (watchlist.isNewMember(member) && await gb.database.getTrackNewMembers(member.guild.id)){
                return watchlist.punishNewMember(member, Offense.Spam);
            }

            this.removeUserMessages(spamMessages);
            const unmuteDate: Date = getMuteDate();
            this.muteQueue.add(member, member.guild.me, unmuteDate, Offense.Spam);
        }
    }

    private removeUserMessages(messages: CachedMessage[]): void {
        if (!messages.length){
            return debug.error(`Tried to remove messages by a person who has no messages in the MessageQueue`, `MessageQueue`)
        }
        const channel = messages[messages.length - 1].channel;
        safeBulkDelete(channel, messages.filter(message => message.channel.id === channel.id));
    }

    public removeUsersRecentMessages(member: GuildMember){
        const guild = this.queue.get(member.guild.id);
        if (!guild){
            return void debug.error(`Cannot bulk delete messages, no guild associated with ${member} in the queue`, 'MessageQueue');
        }
        let messages = [];
        for (let i=guild.length -1 ; i > 0; i--){
            if (guild[i].member.id === member.id){
                messages.push(guild[i]);
            }
        }

        if (!messages.length){
            return void debug.error(`Could not find a message from the user ${member} in the queue`, 'MessageQueue');
        }

        safeBulkDelete(messages[0].channel, messages);
    }

    public checkLockdown(guild : Discord.Guild): boolean {
        //const lockdown : boolean =return true;
        return true;
    }

    private getRecentUserMessages(member : Discord.GuildMember) : CachedMessage[] | void {
        const guild : Discord.Guild = member.guild;
        const tolerance : Date = moment(new Date()).subtract(5, 's').toDate();

        const messages : CachedMessage[] | undefined = this.queue.get(guild.id);

        if (messages === undefined) {
            debug.error(`Tried fetching recent messages in a nonexistent server`, "MessageQueue");
            return;
        }
        return messages.filter(message => {
            return message.author.id === member.user.id &&
                message.guild.id === member.guild.id && message.sent > tolerance;
        }
        );
    }

    public getQueue(channel : Discord.Channel){
        let output : string = "";
        if (channel instanceof Discord.TextChannel){
            const guild = channel.guild;
            const messages : CachedMessage[] | undefined = this.queue.get(guild.id);
            if (messages === undefined) return;
            let messageCount : number = 0;
            for (let i in messages){
                if (messageCount > 200) break;
                output += `${messages[i].author.username}: ${messages[i].content}\n`;
                messageCount++;
            }
            channel.send(output);
        }
    }
}
