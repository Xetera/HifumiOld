import {GuildMember, Message} from "discord.js";
import {gb} from "../../misc/Globals";
import historyEmbed from "../../embeds/commands/historyEmbed";
import {debug} from "../../utility/Logging";
import {Note} from "../../database/models/note";
import {Infraction} from "../../database/models/infraction";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {Database} from "../../database/Database";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";

async function run(message: Message, input: [GuildMember]): Promise<any> {
    const [target] = input;
    const database: Database = gb.database;
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

export const command: Command = new Command({
        names: ['history', 'hs'],
        info:
            "Gets detailed information about a user's account and " +
            "past actions like strikes, notes and warnings",
        usage: '{{prefix}}history { user }',
        examples: [
            '{{prefix}}history @Xetera',
            '{{prefix}}history 140862798832861184',
            '{{prefix}}history xetera'
        ],
        category: 'Moderation',
        expects: [{type: ArgType.Member}],
        run: run,
        userPermissions: UserPermissions.Moderator,
    }
);
