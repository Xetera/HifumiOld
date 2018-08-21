import {gb} from "../../../misc/Globals";

// Storing the URLs of the reactions
// image dimensions are in ? x 150 pixels dimensions
// to prevent it from flooding the chat
export const shocked: string[] = [
    'https://i.imgur.com/WptWHg1.gif',
    'https://i.imgur.com/NZGvl1J.gif',
    'https://i.imgur.com/zbNcJlu.gif',
    'https://i.imgur.com/8OXUnoZ.gif',
    'https://i.imgur.com/Xy55jDc.gif'
];

export const smile: string[] = [
    'https://i.imgur.com/yqhQOcR.gif',
    'https://i.imgur.com/6zFwVUC.png'
];

export const happy: string[] = [
    'https://i.imgur.com/6zFwVUC.png',
    'https://i.imgur.com/yqhQOcR.gif',
    'https://i.imgur.com/ZZ7wPqa.gif',
    //'https://i.imgur.com/Uef8ORJ.png',
    'https://i.imgur.com/jJll2Av.jpg',
    'https://i.imgur.com/NDnCn6h.png'
];

export const blink: string[] = [
    'https://i.imgur.com/OOBGzob.gif',
    'https://i.imgur.com/eLk13wE.gif'
];

export const sorry: string[] = [
    'https://i.imgur.com/mGfezZM.gif',
    'https://i.imgur.com/SR0xDlh.gif'
];

export const shy: string[] = [
    'https://i.imgur.com/irSg9sA.gif'
];

export const apology = 'https://i.imgur.com/OOuZqtz.jpg';

export const weary: string = 'https://i.imgur.com/exx3g8b.gif';
export const crying: string = 'https://i.imgur.com/OjgHJSV.gif';
export const stare: string = 'https://i.imgur.com/MQHFxbQ.jpg';
export const cringe: string = 'https://i.imgur.com/XEAu3BC.gif';
export const peek: string = 'https://i.imgur.com/GcJYU2I.jpg';
export const turn: string = 'https://i.imgur.com/syz1lJl.gif';
export const giggle: string = 'https://i.imgur.com/wPEjqIr.gif';
export const mad: string = 'https://i.imgur.com/dt3abLq.png';

export const canSendReactions = (guildId: string): Promise<boolean> => {
    return gb.database.getReactions(guildId);
}


