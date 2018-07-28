import {Attachment, Message, RichEmbed} from "discord.js";
import {IVoiceActor} from "../../API/anime.interface";

export abstract class IAnime {
    available: boolean = true;
    abstract async getAnime(message: Message, anime: string): Promise<RichEmbed | string>;
    abstract async getCharacter(message: Message, character: string): Promise<RichEmbed>;
    abstract async getVoiceActor(id: number): Promise<IVoiceActor | undefined>;
    abstract async reverseSearch(picture: string, isGif: boolean): Promise<[(RichEmbed | string), (Attachment | undefined)]>;
}

