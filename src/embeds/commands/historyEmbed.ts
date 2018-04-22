import {GuildMember, RichEmbed, User} from "discord.js";
import {INote} from "../../database/TableTypes";
import moment = require("moment");
import {Note} from "../../database/models/note";

export default function historyEmbed(member: GuildMember | User, notes: Note[]){
    const username = member instanceof User ? member.username : member.user.username;
    const discrim = member instanceof User ? member.discriminator : member.user.discriminator;
    const nickname = member instanceof User ? undefined : member.nickname;
    const url = member instanceof User ? member.avatarURL : member.user.avatarURL;
    // we might want to check the Database for a joindate on this for better results
    const joinDate = member instanceof User ? undefined : member.joinedAt;
    const creationDate = member instanceof User ? member.createdAt : member.user.createdAt;

    const embed = new RichEmbed()
        .setTitle(`${username}'s History`)
        .setColor('#f8c4ff')
        .setThumbnail(url);
    let summaryValue = '';
    summaryValue += `**Username**: ${username}#${discrim}\n`;
    if (nickname){
        summaryValue += `**Nickname**: ${nickname}\n`;
    }
    summaryValue += `**Join Date**: ${joinDate ? moment(joinDate).calendar() : 'Not in server'}\n`;
    summaryValue += `**Account Creation Date**: ${moment(creationDate).calendar()}\n\n`;
    embed.addField(`__**Summary**__`, summaryValue);
    //let notesValue = `**${notes.length}** note${notes.length === 1 ? '' : 's'}\n`;
    let notesValue = '';
    for (let i in notes){
        notesValue += `**ID**: __**${notes[i].note_id}**__ **Staff**: __**${notes[i].staff_name}**__\n**Date**: **${moment(notes[i].note_date).calendar()}**\n${notes[i].note_content}\n\n`
    }

    embed.addField(`__**Notes**__`, notesValue ? notesValue : 'No notes found');

    embed.addField(`__**Watchlist Info**__`, `Nothing to see here`);
    return embed;
}
