import {Channel, RichEmbed, TextChannel} from "discord.js";
import lavenshteinDistance from "../../utility/LavenshteinDistance";
import {Command} from "../../handlers/commands/Command";
import {ICommandHandler} from "../../interfaces/injectables/commandHandler.interface";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";
import {IReactionManager} from "../../interfaces/injectables/reactionManager.interface";

export default async function commandNotFoundEmbed(channel: Channel, commandName: string, pool?: string[]){
    const rm: IReactionManager = Container.get(IReactionManager);
    if (!(channel instanceof TextChannel)){
        throw new Error('Can only send embeds to a channel');
    }
    const database: IDatabase = Container.get(IDatabase)
    const commandHandler: ICommandHandler = Container.get(ICommandHandler);
    const commands = commandHandler.commands;
    if (pool){
        pool = commands.map((c:Command)=> c.names[0]).concat(pool)
    }
    else {
        pool = commands.map((c: Command) => c.names[0]);
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
        image = (rm.mad);
    }
    else {
        reaction = 'Huh?';
        didYouMean += ` **${suggestion}**?`;
        image = (rm.weary);
    }
    const embed = new RichEmbed()
        .addField(reaction, didYouMean)
        .setColor('#ffdd51')
        .setFooter(`=> ${await database.getPrefix(channel.guild.id)}hints off <= to disable hints`);

    if (await rm.canSendReactions(channel.guild.id)){
        embed.setThumbnail(image);
    }
    return embed;
}
