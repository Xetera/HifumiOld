import {Channel, RichEmbed, TextChannel} from "discord.js";
import lavenshteinDistance from "../../utility/LavenshteinDistance";
import {Help} from "../../commands/info/help/help.interface";
import ReactionManager from "../../handlers/internal/reactions/reactionManager";
import gb from "../../misc/Globals";
const help: Help = require('../../commands/help.json');

export default async function commandNotFoundEmbed(channel: Channel, commandName: string, pool?: string[]){
    if (!(channel instanceof TextChannel)){
        throw new Error('Can only send embeds to a channel');
    }
    const commands = gb.instance.commandHandler._newCommands;
    if (pool){
        pool = commands.map(c => c.names[0]).concat(pool)
    }
    else {
        pool = commands.map(c => c.names[0]);
    }
    let suggestion: string = lavenshteinDistance(commandName, pool);
    if (commandName.length > 20){
        const substr = commandName.substring(0, 20);
        commandName = `${substr}...`
    }
    let didYouMean = `I don't know what **${commandName}** is, perhaps you meant`;


    let image;
    let reaction;
    if (suggestion ===  'to spam me like some kind of dummy'){
        reaction = 'HUH?!';
        didYouMean += ` ${suggestion}?!`;
        image = (ReactionManager.getInstance().mad);
    }
    else {
        reaction = 'Huh?';
        didYouMean += ` **${suggestion}**?`;
        image = (ReactionManager.getInstance().weary);
    }
    const embed = new RichEmbed()
        .addField(reaction, didYouMean)
        .setColor('#ffdd51')
        .setFooter(`=> ${await gb.instance.database.getPrefix(channel.guild.id)}hints off <= to disable hints`);

    if (await ReactionManager.canSendReactions(channel.guild.id)){
        embed.setThumbnail(image);
    }
    return embed;
}
