import {Message, RichEmbed} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import Anime from "../../API/anime";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {debug} from "../../utility/Logging";
import {randomRuntimeError} from "../../interfaces/Replies";

async function run(message: Message, input: [string]): Promise<any> {
    const [character] = input;
    const placeholder = <Message> await safeSendMessage(message.channel, 'Searching...');
    Anime.getInstance().getCharacter(message, character).then((embed: RichEmbed) => {
        placeholder.edit(embed);
    }).catch(err => {
        debug.error(err);
        placeholder.edit(randomRuntimeError());
    })
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
        dependsOn: ['ANILIST_CLIENT_ID', 'ANILIST_CLIENT_SECRET']
    }
);
