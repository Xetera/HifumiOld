import {Message, RichEmbed} from "discord.js";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {IReactionManager} from "../../interfaces/injectables/reactionManager.interface";

async function run(message: Message): Promise<any> {
    const database: IDatabase = Container.get(IDatabase);
    const rm: IReactionManager = Container.get(IReactionManager);
    const embed = new RichEmbed()
        .setTitle(`:(`)
        .setColor('PURPLE')
        .setDescription(`I'm sorry... Did something break? Am I acting up again?\nYou can get help or shout at the person who made me [here](https://discord.gg/RM6KUrf).`)
        .setFooter(`I still love you though <3`);

    if (await database.getGuildColumn(message.guild.id, 'reactions')){
        embed.setThumbnail(rm.crying)
    }
    safeSendMessage(message.channel, embed);

}

export const command: Command = new Command(
    {
        names: ['yousuck'],
        info: 'Breaks my heart...',
        usage: '{{prefix}}yousuck',
        examples: ['{{prefix}}yousuck'],
        category: 'Info',
        expects: [{type: ArgType.None}],
        run: run,
    }
);
