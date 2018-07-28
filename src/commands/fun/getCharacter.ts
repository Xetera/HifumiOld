import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {debug} from "../../utility/Logging";
import {randomRuntimeError} from "../../interfaces/Replies";
import {IAnime} from "../../interfaces/injectables/anime.interface";
import {Container} from "typescript-ioc";

async function run(message: Message, input: [string]): Promise<any> {
    const [character] = input;
    const placeholder = <Message> await safeSendMessage(message.channel, 'Searching...');
    const anime: IAnime = Container.get(IAnime);

    try {
        const embed = await anime.getCharacter(message, character);
        placeholder.edit(embed);
    } catch (err) {
        debug.error(err, `getCharacter`);
        placeholder.edit(randomRuntimeError());
    }
}

export const command: Command = new Command(
    {
        names: ['character', 'char'],
        info: 'Get information about an anime character.',
        usage: '{{prefix}}character {character name}',
        examples: ['{{prefix}}character Hifumi Takimoto'],
        category: 'Fun',
        expects: [{type: ArgType.Message}],
        run: run,
    }
);
