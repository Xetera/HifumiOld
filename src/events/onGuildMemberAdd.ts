import * as Discord from "discord.js";
import {random} from "../utility/Util";
import {welcomeMessages} from "../interfaces/Replies";
import {Channel, GuildMember, Message, TextChannel} from "discord.js";
import {LogManager} from "../handlers/logging/logManager";
import {debug} from "../utility/Logging";
import guildMemberAddEmbed from "../embeds/events/onGuildMemberAddEmbed";
import {TemplatedMessage} from "../parsers/parsers.interface";
import templateParser from "../parsers/templateParser";
import {IClient} from "../interfaces/injectables/client.interface";
import {ITracklist} from "../interfaces/injectables/tracklist.interface";
import {Container} from "typescript-ioc";
import {IDatabase} from "../interfaces/injectables/datbase.interface";

export default async function onGuildMemberAdd(member : Discord.GuildMember): Promise<void> {
    const database: IDatabase = Container.get(IDatabase);
    const bot: IClient = Container.get(IClient);
    const trackList: ITracklist = Container.get(ITracklist);
    if (!database.ready
        || bot.sleeping
        || member.user.bot
        || !await database.getGuildColumn(member.guild.id, 'enabled')
        || !member.guild.available){
        return
    }

    await database.addMember(member);
    await trackList.add(member);

    // we will change this later to fetch from a Database instead of using a preset name
    const [welcomeChannelId, customMessage] = await Promise.all([
        database.getGuildColumn(member.guild.id, 'welcome_channel'),
        database.getGuildColumn(member.guild.id, 'welcome_message')
    ]);

    if (welcomeChannelId) {
        const welcomeChannel: Channel | undefined = member.guild.channels.get(welcomeChannelId);
        if (!welcomeChannel) {
            debug.error(`Welcome channel saved in the database for guild ${member.guild.name} no longer exists`, 'GuildMemberAdd')
        }

        else if (welcomeChannel instanceof Discord.TextChannel) {
            sendEmbed(welcomeChannel, member, customMessage)
        }
    }

    LogManager.logMemberJoin(member);
}

function sendEmbed(channel: TextChannel, member: GuildMember, welcomeMessage?: string){
    const database: IDatabase = Container.get(IDatabase);
    let defaultChannelEmbed;
    if (welcomeMessage){
        const fields: TemplatedMessage | string = templateParser(
            ['title', 'description', 'footer', 'thumbnail', 'color'], welcomeMessage);

        let description;
        let title;
        let footer;
        let thumbnail;
        let color;
        if (typeof fields !== 'string'){
            if (fields._default || fields['description']){
                description = fields._default.concat(fields['description']);
            }
            title = fields['title'];
            footer = fields['footer'];
            thumbnail = fields['thumbnail'];
            color = fields['color'];
            defaultChannelEmbed = guildMemberAddEmbed(member, description, title, footer, color, thumbnail);
        }
    }
    else {
        defaultChannelEmbed = guildMemberAddEmbed(member,
            random(welcomeMessages(member)),
            `${member.user.username} has joined ${member.guild.name}!`,
            undefined,
            'GREEN',
            member.user.avatarURL
        );
    }

    channel.send(defaultChannelEmbed).then((welcomeMessage: Message | Message[])=> {
        if (Array.isArray(welcomeMessage)) {
            return;
        }
        const kanna_wave = member.client.emojis.find('name', 'hifumi_kanna_wave');

        if (kanna_wave !== undefined)
            welcomeMessage.react(kanna_wave);
        else
            debug.error('Could not react to new user joining with kanna_wave');
        database.cacheWelcomeMessage(member, welcomeMessage);
    });
}
