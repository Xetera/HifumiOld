import * as Discord from "discord.js";
import * as dbg from "debug";
import {random} from "../utility/Util";
import {welcomeMessages} from "../interfaces/Replies";
import {Database} from "../database/Database";
import {default as gb, Instance} from "../misc/Globals";
import guildMemberAddEmbed from "../embeds/events/onGuildMemberAddEmbed";
import {Channel, GuildMember, Message, TextChannel} from "discord.js";
import {LogManager} from "../handlers/logging/logManager";
import {debug} from "../utility/Logging";

export default async function onGuildMemberAdd(member : Discord.GuildMember): Promise<void> {
    const database = gb.instance.database;
    await database.addMember(member);
    gb.instance.trackList.add(member);
    // we will change this later to fetch from a Database instead of using a preset name
    const welcomeChannelId : string | undefined = await database.getWelcomeChannel(member.guild.id);
    const welcomeMessage : string = random(welcomeMessages(member));

    if (welcomeChannelId === undefined) {
        return debug.info(`Could not send a member join message to ${member.guild.name} `+
        `because a welcome channel was missing.`, 'GuildMemberAdd');
    }
    const welcomeChannel: Channel | undefined = member.guild.channels.get(welcomeChannelId);
    if (!welcomeChannel){
        return void debug.error(`Welcome channel saved in the database for guild ${member.guild.name} no longer exists`, 'GuildMemberAdd')
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
