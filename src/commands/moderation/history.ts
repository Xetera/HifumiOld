import {GuildMember, Message, Permissions, TextChannel, User} from "discord.js";
import gb from "../../misc/Globals";
import historyEmbed from "../../embeds/commands/historyEmbed";
import {debug} from "../../utility/Logging";
import {Note} from "../../database/models/note";
import {Infraction} from "../../database/models/infraction";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {Database} from "../../database/Database";

export default async function getHistory(message: Message, input: [GuildMember]){
    const [target] = input;
    const database: Database = gb.instance.database;
    return Promise.all([
        database.getNotes(target.id, message.guild.id),
        database.getInfractions(message.guild.id, target.id),
        database.getInfractionLimit(message.guild.id),
        database.incrementHistoryCalls(message.guild.id, target.id)
    ]).then(async(r: [Note[], Infraction[], number, void]) => {

        const [notes, infractions, limit] = r;
        const embed = await historyEmbed(target, notes, infractions, limit);
        return safeSendMessage(message.channel, embed);

    }).catch(err => {
        debug.error(err.stack);
    });
}
