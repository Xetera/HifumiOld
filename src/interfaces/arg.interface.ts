export type AllChannelTypes = 'text' | 'voice' | 'BOTH';

export enum ArgType {
    String = 'string',
    Number = 'number',
    Member = 'member',
    Message = 'message',
    Boolean = 'boolean',
    Channel = 'channel',
    None = 'none'
}

export interface ArgOptions {
    type: ArgType;
    options?: {
        minRange?: number;
        maxRange?: number;
        optional?: boolean;
        maxLength?: number;
        channelType?: AllChannelTypes;
        minWords?: number;
        raw?: boolean;
        strict?: boolean;
    }
}
