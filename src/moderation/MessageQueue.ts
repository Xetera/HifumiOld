import * as Discord from "discord.js";
import * as moment from "moment";

import {MuteQueue} from "./MuteQueue";
import {
    getBulkDeleteCount, getMuteDate, getMuteTime, getSpamTolerance, securityLevel,
    SecurityLevels
} from "../utility/Settings";
import {debug} from '../utility/Logging'
import {Database} from "../database/Database";
import Watchlist from "./Watchlist";
import gb from "../misc/Globals";

interface Message extends Discord.Message {
    sent : Date;
}
type messageCollection = Discord.Collection<Discord.Snowflake, Discord.Message>;

export class MessageQueue {
    queue : Map<string, Message[]>;
    watchlist: Watchlist;
    bufferLength : number;
    muteQueue : MuteQueue;
    db : Database;
    constructor(muteQueue : MuteQueue, database: Database,watchlist: Watchlist, size ?: number){
        this.muteQueue = muteQueue;
        this.db = database;
        this.queue = new Map<string, Message[]>();
        this.watchlist = watchlist;
        this.bufferLength = size ? size : 200;
        debug.info('MessageQueue is ready.', "MessageQueue");
    }

    public add(msg: Message) : void {
        const self = this;

        msg.sent = moment(new Date()).toDate();
        const guild : Message[] | undefined = this.queue.get(msg.guild.id);
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
                const temp : Message | undefined = value.shift();
                if (temp === undefined)
                    debug.error(`Tried to shift out an empty message from ${guildName}'s messageQueue` +
                        `\nMost likely because buffer length is 0 or undefined.`, "MessageQueue");
            }
        });
        this.checkForSpam(msg.member);
    }

    //gets called every message
    private checkForSpam(member : Discord.GuildMember) : void {
        const spamMessages : Message[] | void = this.getRecentUserMessages(member);
        if (!spamMessages) return;

        if (spamMessages == null) return;
        const isUserSpamming : boolean = spamMessages.length >= getSpamTolerance();

        if (isUserSpamming){
            // checking if the user is new before punishing
            if (gb.instance.watchlist.isNewMember(member)){
                
            }
            this.removeUserMessages(spamMessages);
            const unmuteDate: Date = getMuteDate();
            const mutedRole: Discord.Role = member.guild.roles.find('name', 'muted');
            const muted: boolean = this.muteQueue.add(member, mutedRole, unmuteDate);
        }
    }

    private removeUserMessages(messages: Message[]): void {
        // guaranteed that all messages are by the same author so we can just take the first index
        const member : Discord.GuildMember = messages[0].member;
        const memberName :string = messages[0].member.nickname || messages[0].author.username;
        const guild : Discord.Guild = messages[0].guild;
        // breaking down all the unique channels
        const channels : Set<Discord.Channel> = new Set(messages.map(message => message.channel));

        channels.forEach(function(channel : Discord.Channel){
            if (channel instanceof Discord.TextChannel){
                const dateLimit: Date = moment(new Date()).subtract('14', 'd').toDate();
                channel.fetchMessages({limit: getBulkDeleteCount()}).then((messages : messageCollection) => {
                    const userMessages = messages.filter(
                        // we want to avoid fetching messages that are created over 14 days ago
                        message => message.author.id === member.id && message.createdAt >  dateLimit
                    );
                    channel.bulkDelete(userMessages);
                });
            }
        });
    }

    public checkLockdown(guild : Discord.Guild): boolean {
        //const lockdown : boolean =return true;
        return true;
    }

    private getRecentUserMessages(member : Discord.GuildMember) : Message[] | void {
        const guild : Discord.Guild = member.guild;
        const tolerance : Date = moment(new Date()).subtract(5, 's').toDate();

        const messages : Message[] | undefined = this.queue.get(guild.id);

        if (messages === undefined) {
            debug.error(`Tried fetching recent messages in a nonexistent server`, "MessageQueue");
            return;
        }
        return messages.filter(message => {
            return message.author.id === member.user.id && message.guild.id === member.guild.id && message.sent > tolerance;
        }
        );
    }

    private getAllUserMessages(member : Discord.GuildMember) : Message[] | void {
        const messages : Message[] | undefined = this.queue.get(member.guild.id);
        if (messages === undefined) return debug.error(`Guild ${member.guild} has no messages to get`, "MessageQueue");
        return messages.filter(message => {
            return message.author.id === member.id
        })
    }

    private getMutedRole(guild : Discord.Guild){

    }

    public getQueue(channel : Discord.Channel){
        let output : string = "";
        if (channel instanceof Discord.TextChannel){
            const guild = channel.guild;
            const messages : Message[] | undefined = this.queue.get(guild.id);
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