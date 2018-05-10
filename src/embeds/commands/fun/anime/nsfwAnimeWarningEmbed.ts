import {RichEmbed} from "discord.js";

export default function nsfwAnimeWarningEmbed(){
    return new RichEmbed()
        .setTitle(`What?! Ewwww`)
        .setDescription(`Lewd!୧( ಠ Д ಠ )୨  ┻━┻ ヘ╰( •̀ε•́ ╰)\nThat's an adult anime!\nI can only send those in nsfw channels.`)
        .setColor(`#f57d7d`)
        .setImage('https://cdn.discordapp.com/attachments/443834322781470731/444062232054202368/surprised3.jpg')
}
