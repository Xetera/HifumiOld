import {GuildMember, RichEmbed, User} from "discord.js";
import moment = require("moment");
import {Note} from "../../database/models/note";
import gb from "../../misc/Globals";
import {getMemberTrackDuration} from "../../utility/Settings";
import {emptySpace} from "../../utility/Util";
import {Infraction} from "../../database/models/infraction";
import InfractionHandler from "../../handlers/internal/infractions/InfractionHandler";

export default async function historyEmbed(member: GuildMember | User, notes: Note[], infractions: Infraction[], infractionLimit: number){
    const username     = member instanceof User ? member.username : member.user.username;
    const discrim      = member instanceof User ? member.discriminator : member.user.discriminator;
    const nickname     = member instanceof User ? undefined : member.nickname;
    const url          = member instanceof User ? member.avatarURL : member.user.avatarURL;
    const joinDate     = member instanceof User ? undefined : member.joinedAt;
    const creationDate = member instanceof User ? member.createdAt : member.user.createdAt;
    const tracked      = member instanceof User ? undefined : gb.instance.trackList.getMember(member);
    const history_calls= member instanceof User ? '?' : await gb.instance.database.getHistoryCalls(member.guild.id, member.id);

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
    summaryValue += `**Number of History Requests**: ${history_calls} time${history_calls > 1 ? 's' : ''}\n`;

    if (tracked){
        summaryValue += `__This user is tracked until__: ${moment(tracked.join_date.toISOString()).subtract(getMemberTrackDuration()).calendar()}`
    }
    embed.addField(`__**Summary**__`, summaryValue);


    /* Notes */
    let notesValue:string[] = [`**${notes.length}** notes on record\n`];
    for (let i in notes){
        notesValue.push(`**ID**: __**${notes[i].note_id}**__ **Staff**: __**${notes[i].staff_name}**__\n**Date**: ${moment(notes[i].note_date).calendar()}\n${notes[i].note_content}\n`)
    }
    const notesTotal = notes.length !== 0 ? notesValue.join('\n') : 'Nothing noted so far.';

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

    infractionsValue = infractions.length ? infractionsValue : 'Squeaky clean sir!';

    embed.addField(`__**Infractions**__`, infractionsValue);
    embed.addField(`__**Notes**__`, notesTotal);
    return embed;
}
