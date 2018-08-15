import {RichEmbed} from "discord.js";
import {IHifumi} from "../../misc/hifumi.interface";
const hifumi: IHifumi = require('./../../../bot.json');


export default function inviteEmbed(){
    return new RichEmbed({
        title: 'Invites',
        description:
        '[Support Server](https://discord.gg/RM6KUrf)\n' +
        '[Invite Me](https://discordapp.com/oauth2/authorize?client_id=372615866652557312&scope=bot&permissions=268463300)',
        footer: {
            text: 'Hifumi v' + hifumi.version,
            icon_url: 'https://cdn.discordapp.com/avatars/372615866652557312/c106f4dcedac9acf574381d78cf55313.png?size=2048'
        }
    }).setColor('#fca1ff')
}
