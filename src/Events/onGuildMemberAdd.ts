import * as Discord from "discord.js";
import * as dbg from "debug";
import {randChoice} from "../Utility/Util";
import {welcomeMessages} from "../Handlers/Replies";
import {Database} from "../Database/Database";
import {Instance} from "../Misc/Globals";

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
    const welcomeChannel : Discord.Channel | undefined = member.guild.channels.find('name', 'welcome');
    const defaultChannelId : string | undefined = database.getDefaultChannel(member.guild.id);
    const defaultChannel : Discord.Channel | undefined = member.guild.channels.find(
        'id', defaultChannelId
    );
    const identifier     : string = member.user.bot ? 'A new bot' : 'A new human';
    const welcomeMessage : string = randChoice(welcomeMessages);

    if (welcomeChannel === undefined) {
        return debug.info(`Could not send a member join message to ${member.guild.name} `+
        `because a welcome channel was missing.`);
    }

    else if (welcomeChannel instanceof Discord.TextChannel){
        let welcomeChannelEmbed : Discord.RichEmbed= new Discord.RichEmbed()
            .setAuthor(member.displayName, member.user.displayAvatarURL)
            .setTimestamp()
            .setColor("GREEN")
            .setTitle(`${identifier} has joined the server!`);
        welcomeChannel.send(welcomeChannelEmbed);

    }

    if (defaultChannel && defaultChannel instanceof Discord.TextChannel){
        let defaultChannelEmbed : Discord.RichEmbed= new Discord.RichEmbed()
            .setAuthor(member.displayName, member.user.displayAvatarURL)
            .setColor("GREEN")
            .setTitle(`${identifier} has joined the server!`)
            .setDescription(welcomeMessage);
        defaultChannel.send(defaultChannelEmbed).then(welcomeMessage => {
            if (welcomeMessage instanceof Discord.Message){
                // is not an array of messages
                welcomeMessage.react('👋');
            }
        });
    }
    else if(!defaultChannel){
        debug.silly(`Could not get a systemChannel to log a user join in ${member.guild.name}`);
    }

}