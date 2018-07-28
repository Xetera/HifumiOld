export abstract class IReactionManager {
    shocked: string[];
    smile: string[];
    happy: string[];
    blink: string[];
    sorry: string[];
    shy: string[];
    public readonly weary: string = 'https://i.imgur.com/exx3g8b.gif';
    public readonly crying: string = 'https://i.imgur.com/OjgHJSV.gif';
    public readonly stare: string = 'https://i.imgur.com/MQHFxbQ.jpg';
    public readonly cringe: string = 'https://i.imgur.com/XEAu3BC.gif';
    public readonly peek: string = 'https://i.imgur.com/GcJYU2I.jpg';
    public readonly turn: string = 'https://i.imgur.com/syz1lJl.gif';
    public readonly giggle: string = 'https://i.imgur.com/wPEjqIr.gif';
    public readonly mad: string = 'https://i.imgur.com/dt3abLq.png';

    abstract async canSendReactions(guildId: string): Promise<boolean>;
}
