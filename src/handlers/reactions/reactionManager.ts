import gb from "../../misc/Globals";

export default class ReactionManager /* extends Singleton */{
    private static _instance: ReactionManager;
    // Storing the URLs of the reactions
    // image dimensions are in ? x 150 pixels dimensions
    // to prevent it from flooding the chat
    public readonly shocked: string[] = [
        'https://i.imgur.com/WptWHg1.gif',
        'https://i.imgur.com/NZGvl1J.gif',
        'https://i.imgur.com/If6kDmM.jpg',
        'https://i.imgur.com/zbNcJlu.gif',
        'https://i.imgur.com/8OXUnoZ.gif',
        'https://i.imgur.com/Xy55jDc.gif'
    ];

    public smile: string[] = [
        'https://i.imgur.com/yqhQOcR.gif',
        'https://i.imgur.com/6zFwVUC.png'
    ];

    public readonly happy: string[] = [
        'https://i.imgur.com/6zFwVUC.png',
        'https://i.imgur.com/yqhQOcR.gif',
        'https://i.imgur.com/ZZ7wPqa.gif',
        'https://i.imgur.com/Uef8ORJ.png?1',
        'https://i.imgur.com/jJll2Av.jpg',
        'https://i.imgur.com/NDnCn6h.png'
    ];

    public readonly blink: string[] = [
        'https://i.imgur.com/OOBGzob.gif',
        'https://i.imgur.com/eLk13wE.gif'
    ];

    public readonly sorry: string[] = [
        'https://i.imgur.com/mGfezZM.gif',
        'https://i.imgur.com/SR0xDlh.gif'
    ];

    public readonly apology = 'https://i.imgur.com/OOuZqtz.jpg';
    public readonly shy: string = 'https://i.imgur.com/irSg9sA.gif';
    public readonly weary: string = 'https://i.imgur.com/exx3g8b.gif';
    public readonly crying: string = 'https://i.imgur.com/OjgHJSV.gif';
    public readonly stare: string = 'https://i.imgur.com/SZ1AXR1.jpg';
    public readonly cringe: string = 'https://i.imgur.com/XEAu3BC.gif';
    public readonly peek: string = 'https://i.imgur.com/GcJYU2I.jpg';
    public readonly turn: string = 'https://i.imgur.com/syz1lJl.gif';
    public readonly giggle: string = 'https://i.imgur.com/wPEjqIr.gif';
    public readonly mad: string = 'https://i.imgur.com/dt3abLq.png';

    private constructor(){}

    public static getInstance() {
        if (!ReactionManager._instance) {
            ReactionManager._instance = new this();
        }
        return ReactionManager._instance;
    }

    public static async canSendReactions(guildId: string): Promise<boolean>{
        return gb.instance.database.getReactions(guildId);
    }


}
