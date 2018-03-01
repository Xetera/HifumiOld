import * as Discord from "discord.js";
import * as moment from "moment";

import {MuteQueue} from "./MuteQueue";
import {getMuteDate, getMuteTime, getSpamTolerance, securityLevel, SecurityLevels} from "../utility/Settings";
import * as dbg from "debug";


const debug = {
    silly   : dbg('Bot:MessageQueue:Silly'),
    info    : dbg('Bot:MessageQueue:Info'),
    warning : dbg('Bot:MessageQueue:Warning'),
    error   : dbg('Bog:MessageQueue:Error')
};

interface Message extends Discord.Message {
    sent : Date;
}

export class MessageQueue {
    queue : Map<Discord.Guild, Message[]>;
    bufferLength : number;
    muteQueue : MuteQueue;
    constructor(muteQueue : MuteQueue, size ?: number){
        this.muteQueue = muteQueue;
        this.queue = new Map<Discord.Guild, Message[]>();
        this.bufferLength = size ? size : 200;
        debug.info('MessageQueue is ready.');
    }

    public add(msg: Message) : void {
        const self = this;

        msg.sent = moment(new Date()).toDate();
        const guild : Message[] | undefined = this.queue.get(msg.guild);
        if (guild === undefined){
            this.queue.set(msg.guild, [msg]);
        }
        else {
            guild.push(msg);
        }

        this.queue.forEach(function(value, key, map){
            //  value.length => length of messages stored in the message queue
            if (value.length > self.bufferLength){
                const temp : Message | undefined = value.shift();
                if (temp === undefined)
                    debug.error(`Tried to shift out an empty message from ${key.name}'s messageQueue` +
                        `\nMost likely because buffer length is 0 or undefined.`);
            }
        });
        this.checkForSpam(msg.member);
    }

    //gets called every messages
    private checkForSpam(member : Discord.GuildMember) : void {
        const spamMessages : Message[] | void = this.getRecentUserMessages(member);

        if (spamMessages == null) return;
        const isUserSpamming : boolean = spamMessages.length > getSpamTolerance();

        if (isUserSpamming){
            this.removeUserMessages(spamMessages);
            const unmuteDate : Date = getMuteDate();
            const mutedRole : Discord.Role = member.guild.roles.find('name', 'muted');
            this.muteQueue.add(member, mutedRole, unmuteDate);
        }
    }

    private removeUserMessages(messages : Message[]) : void {
        // guaranteed that all messages are by the same author so we can just take the first index
        const member : Discord.GuildMember = messages[0].member;
        const memberName :string = messages[0].member.nickname || messages[0].author.username;
        const guild : Discord.Guild = messages[0].guild;
        // breaking down all the unique channels


        // guaranteed that all messages are in the same guild
        if (securityLevel === SecurityLevels.High){
            debug.silly('Removing spammer in high security mode');
            const allMessages : Discord.Message[]  | void = this.getAllUserMessages(member);
            if (messages !== undefined){
                
            }
        }
        // in case user is spamming in more than one channel
        const channelIDs : string[] = Array.from(new Set(messages.map(message => message.channel.id)));
        for (let channelID of channelIDs){

            const targetChannel : Discord.Channel = guild.channels.find('id', channelID);

            if (targetChannel instanceof Discord.TextChannel){
                const channelMessages : Message[] = messages.filter(
                    msg=> msg.channel.id === targetChannel.id
                );
                // delete everything in channel
                targetChannel.bulkDelete(channelMessages);

                const guildMessages : Message[] | undefined = this.queue.get(guild);
                if (guildMessages === undefined) return debug.error(`Tried to get ${guild.name} messages in MessageQueue but key does not exist.`);

                for (let i in messages){
                    try{
                        guildMessages.splice(guildMessages.findIndex(msg=> msg.id === messages[i].id), 1);
                    }
                    catch (error) {
                        debug.error(`Error splicing array for ${guild.name}'s messages in MessageQueue`);
                    }
                }
                debug.info(`Deleted ${messages.length} messages from ${memberName} in ${targetChannel.name}`);
            }
        }
    }

    private getRecentUserMessages(member : Discord.GuildMember) : Message[] | void {
        const guild : Discord.Guild = member.guild;
        const tolerance : Date = moment(new Date()).subtract(5, 's').toDate();

        const messages : Message[] | undefined = this.queue.get(guild);

        if (messages === undefined) {
            debug.error(`Tried fetching recent messages in a nonexistent server`);
            return;
        }
        return messages.filter(message => {
            return message.author.id === member.user.id && message.guild.id === member.guild.id && message.sent > tolerance;
        }
        );
    }

    private getAllUserMessages(member : Discord.GuildMember) : Message[] | void {
        const messages : Message[] | undefined = this.queue.get(member.guild);
        if (messages === undefined) return debug.error(`Guild ${member.guild} has no messages to get`);
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
            const messages : Message[] | undefined = this.queue.get(guild);
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