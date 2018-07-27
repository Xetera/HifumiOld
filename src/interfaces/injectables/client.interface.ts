import {Client} from 'discord.js'

/**
 * somewhat of a hack. We want to stay consistent with
 * our naming schema, and be able to work with DI
 */
export abstract class IClient extends Client{
    public sleeping: boolean = false;
    public owner: string;
}

export abstract class DiscordClient extends IClient {
    public sleeping: boolean = false;
}

