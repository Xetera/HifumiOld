import {GuildMember, Message} from "discord.js";
import historyEmbed from "../../embeds/commands/historyEmbed";
import {debug} from "../../utility/Logging";
import {Note} from "../../database/models/note";
import {Infraction} from "../../database/models/infraction";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";
import {randomRuntimeError} from "../../interfaces/Replies";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

async function run(message: Message, input: [GuildMember]): Promise<any> {
    const [target] = input;
    const database: IDatabase = Container.get(IDatabase)
    return Promise.all([
        database.getNotes(target.id, message.guild.id),
        database.getInfractions(message.guild.id, target.id),
        database.getGuildColumn(message.guild.id, 'infraction_limit'),
        database.incrementHistoryCalls(message.guild.id, target.id)
    ]).then(async(r: [Note[], Infraction[], (undefined | number), void]) => {

        const [notes, infractions, limit] = r;
        if (!limit){
            return safeSendMessage(message.channel, randomRuntimeError());
        }
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
