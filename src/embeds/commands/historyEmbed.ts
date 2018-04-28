import {GuildMember, RichEmbed, User} from "discord.js";
import moment = require("moment");
import {Note} from "../../database/models/note";
import gb from "../../misc/Globals";
import {getMemberTrackDuration} from "../../utility/Settings";
import {emptySpace} from "../../utility/Util";
import {Infraction} from "../../database/models/infraction";
import InfractionHandler from "../../handlers/infractions/InfractionHandler";

export default function historyEmbed(member: GuildMember | User, notes: Note[], infractions: Infraction[], infractionLimit: number){
    const username     = member instanceof User ? member.username : member.user.username;
    const discrim      = member instanceof User ? member.discriminator : member.user.discriminator;
    const nickname     = member instanceof User ? undefined : member.nickname;
    const url          = member instanceof User ? member.avatarURL : member.user.avatarURL;
    const joinDate     = member instanceof User ? undefined : member.joinedAt;
    const creationDate = member instanceof User ? member.createdAt : member.user.createdAt;
    const tracked      = member instanceof User ? undefined : gb.instance.trackList.getMember(member);

    const embed = new RichEmbed()
        .setTitle(`${username}'s History`)
        .setColor('#f8c4ff')
        .setThumbnail(url);

    /* Summary */
    let summaryValue = '';
    summaryValue += `**Username**: ${username}#${discrim}\n`;

    if (nickname){
        summaryValue += `**Nickname**: ${nickname}\n`;
    }

    summaryValue += `**Join Date**: ${joinDate ? moment(joinDate).calendar() : 'Not in server'}\n`;
    summaryValue += `**Account Creation Date**: ${moment(creationDate).calendar()}\n`;

    if (tracked){
        summaryValue += `__This user is tracked until__: ${moment(tracked.join_date.toISOString()).subtract(getMemberTrackDuration()).calendar()}\n\n`
    }
    embed.addField(`__**Summary**__`, summaryValue + emptySpace);


    /* Notes */
    let notesValue = `**${notes.length}** notes on record\n\n`;
    for (let i in notes){
        notesValue += `**ID**: __**${notes[i].note_id}**__ **Staff**: __**${notes[i].staff_name}**__\n**Date**: ${moment(notes[i].note_date).calendar()}\n${notes[i].note_content}\n` + emptySpace
    }
    notesValue = notes.length !== 0 ? notesValue : 'Nothing noted so far.\n';

    notesValue = notesValue ? notesValue : 'Super ';

    /* Infractions */
    const date = new Date();
    const activeInfractions = infractions.reduce((sum, i: Infraction ) => {
        if (i.infraction_date <= date){
            sum += i.infraction_weight;
        }
        return sum;
    }, 0);
    let infractionsValue = `**${infractions.length}** infractions on record.\nTotal active strikes: **${activeInfractions}/${infractionLimit}**\n\n`;
    infractionsValue += infractions.map(i => InfractionHandler.formatInfraction(i))
        .join('\n');

    infractionsValue = infractions.length !== 0 ? infractionsValue : 'Squeaky clean sir!\n';

    embed.addField(`__**Infractions**__`, infractionsValue + emptySpace)
    embed.addField(`__**Notes**__`, notesValue + emptySpace);
    embed.addField(`__**Watchlist Info**__`, `Nothing to see here`);
    return embed;
}
