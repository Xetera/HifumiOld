import {Client, Guild} from 'discord.js'
import {Environments} from "../../events/systemStartup";

/**
 * somewhat of a hack. We want to stay consistent with
 * our naming schema, and be able to work with DI
 */
export abstract class IClient extends Client{
    abstract sleeping: boolean = false;
    abstract owner: string;
    abstract env: Environments;
    abstract emojiGuild?: Guild;
    abstract getEmoji(name: string): string;
}

export abstract class DiscordClient extends IClient {
    abstract sleeping: boolean = false;
    abstract owner: string;
    abstract env: Environments;
    abstract emojiGuild?: Guild;
    public getEmoji(name: string): string {
        if (!this.emojiGuild){
            return '';
        }
        const emoji = this.emojiGuild.emojis.find(e => e.name === name);
        if (!emoji){
            return '';
        }
        return emoji.toString();
    }
}

