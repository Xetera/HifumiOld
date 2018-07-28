import {Message, RichEmbed} from "discord.js";
import {gb} from "../../misc/Globals";
import ReactionManager from "../../handlers/internal/reactions/reactionManager";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";

async function run(message: Message): Promise<any> {
    const embed = new RichEmbed()
        .setTitle(`:(`)
        .setColor('PURPLE')
        .setDescription(`I'm sorry... Did something break? Am I acting up again?\nYou can get help or shout at the person who made me [here](https://discord.gg/RM6KUrf).`)
        .setFooter(`I still love you though <3`);

    if (await gb.database.getReactions(message.guild.id)){
        embed.setThumbnail(ReactionManager.getInstance().crying)
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
