import * as Discord from "discord.js";
import * as dbg from "debug";
import {random} from "../utility/Util";
import {welcomeMessages} from "../interfaces/Replies";
import {Database} from "../database/Database";
import {default as gb, Instance} from "../misc/Globals";
import guildMemberAddEmbed from "../embeds/events/onGuildMemberAddEmbed";
import {Channel, GuildMember, Message, TextChannel} from "discord.js";
import {LogManager} from "../handlers/logging/logManager";

export const debug = {
    silly  : dbg('Bot:onGuildMemberAdd:Silly'),
    info   : dbg('Bot:onGuildMemberAdd:Info'),
    warning: dbg('Bot:onGuildMemberAdd:Warning'),
    error  : dbg('Bot:onGuildMemberAdd:Error')
};

export default function onGuildMemberAdd(member : Discord.GuildMember, instance: Instance) : void {
    const database = instance.database;
    database.insertMember(member);

    // we will change this later to fetch from a database instead of using a preset name
    const welcomeChannel : Channel | undefined = database.getWelcomeChannel(member.guild.id);

    const identifier     : string = member.user.bot ? 'A new bot' : 'A new human';
    const welcomeMessage : string = random(welcomeMessages);

    if (welcomeChannel === undefined) {
        return debug.info(`Could not send a member join message to ${member.guild.name} `+
        `because a welcome channel was missing.`);
    }

    else if (welcomeChannel instanceof Discord.TextChannel){
        sendEmbed(welcomeChannel, member, welcomeMessage)
    }

    LogManager.logMemberJoin(member);
}

function sendEmbed(channel: TextChannel, member: GuildMember, welcomeMessage: string, ){
    let defaultChannelEmbed : Discord.RichEmbed = guildMemberAddEmbed(member, welcomeMessage);
    channel.send(defaultChannelEmbed).then((welcomeMessage: Message | Message[])=> {
        if (Array.isArray(welcomeMessage)) {
            return;
        }
        // is not an array of messages
        const kanna_wave = member.client.emojis.find('name', 'alexa_kanna_wave');

        if (kanna_wave !== undefined)
            welcomeMessage.react(kanna_wave);
        else
            debug.error('Could not react to new user joining with kanna_wave');
        gb.instance.database.cacheWelcomeMessage(member, welcomeMessage);
    });
}