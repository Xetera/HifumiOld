import {Message, RichEmbed} from 'discord.js'
import {ArgType} from "../../decorators/expects";
import Anime from "../../API/anime";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {randomRuntimeError, runtimeErrorResponses} from "../../interfaces/Replies";
import {debug} from "../../utility/Logging";
import gb from "../../misc/Globals";
import {random} from "../../utility/Util";

const placeholders = [
    'Searching...',
    'Contacting the anime gods...',
    'Looking through my stash...',
    'Digging through my collection...',
    'Asking some weeb...',
    "Finding that Japanese children's show...",
    'Going through my anime contacts...'
];

export async function getAnime(message: Message, input: [string]): Promise<any> {
    const [anime] = input;
    const placeholder = <Message> await safeSendMessage(
        message.channel,
        `${gb.emojis.get('hifumi_kanna_inspect')} ${random(placeholders)}`
    );
    Anime.getInstance().getAnime(message, anime).then((embed: RichEmbed) => {
        placeholder.edit(embed);
    }).catch(err =>{
        debug.error(err, `Anime`);
        placeholder.edit(randomRuntimeError());
    })
}
