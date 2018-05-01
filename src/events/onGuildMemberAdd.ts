import * as Discord from "discord.js";
import * as dbg from "debug";
import {random} from "../utility/Util";
import {welcomeMessages} from "../interfaces/Replies";
import {Database} from "../database/Database";
import {default as gb, Instance} from "../misc/Globals";
import {Channel, GuildMember, Message, TextChannel} from "discord.js";
import {LogManager} from "../handlers/logging/logManager";
import {debug} from "../utility/Logging";
import guildMemberAddEmbed from "../embeds/events/onGuildMemberAddEmbed";
import {TemplatedMessage} from "../parsers/parsers.interface";
import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
import templateParser from "../parsers/templateParser";

export default async function onGuildMemberAdd(member : Discord.GuildMember): Promise<void> {
    if (gb.instance.database.ready || !await gb.instance.database.getGuildEnabled(member.guild.id)){
        return;
    }

    const database = gb.instance.database;
    await database.addMember(member);
    gb.instance.trackList.add(member);
    // we will change this later to fetch from a Database instead of using a preset name
    const [welcomeChannelId, customMessage] = await Promise.all([database.getWelcomeChannel(member.guild.id),
        database.getWelcomeMessage(member.guild.id)
    ]);

    if (!welcomeChannelId) {
        return;
    }

    const welcomeChannel: Channel | undefined = member.guild.channels.get(welcomeChannelId);
    if (!welcomeChannel){
        return void debug.error(`Welcome channel saved in the database for guild ${member.guild.name} no longer exists`, 'GuildMemberAdd')
    }

    else if (welcomeChannel instanceof Discord.TextChannel){
        sendEmbed(welcomeChannel, member, customMessage)
    }

    LogManager.logMemberJoin(member);
}

function sendEmbed(channel: TextChannel, member: GuildMember, welcomeMessage?: string){
    let defaultChannelEmbed;
    if (welcomeMessage){
        const fields: TemplatedMessage | string = templateParser(['title', 'description', 'footer'], welcomeMessage);

        let description;
        let title;
        let footer;
        if (typeof fields !== 'string'){
            if (fields._default || fields['description']){
                description = fields._default.concat(fields['description']);
            }
            title = fields['title'];
            footer = fields['footer'];
            defaultChannelEmbed = guildMemberAddEmbed(member, description, title, footer);
        }
    }
    else {
        defaultChannelEmbed = guildMemberAddEmbed(member);
    }

    channel.send(defaultChannelEmbed).then((welcomeMessage: Message | Message[])=> {
        if (Array.isArray(welcomeMessage)) {
            return;
        }
        const kanna_wave = member.client.emojis.find('name', 'alexa_kanna_wave');

        if (kanna_wave !== undefined)
            welcomeMessage.react(kanna_wave);
        else
            debug.error('Could not react to new user joining with kanna_wave');
        gb.instance.database.cacheWelcomeMessage(member, welcomeMessage);
    });
}
