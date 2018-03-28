import * as Discord from 'discord.js'
import {debug} from '../../utility/Logging'
import gb from "../../misc/Globals";

export default function setAvatar(message: Discord.Message, URL : string){

    const me : Discord.ClientUser = message.client.user;
    const lul = gb.emojis.get('alexa_lul');
    if (URL === '' || URL === undefined)
        return message.channel.send(`Change avatar to what? ${lul} send me a URL.`);

    me.setAvatar(URL).then(response => {
        debug.info(`${response.username} avatar successfully changed!.`);
        message.channel.send('New avatar, new me.');
    }).catch (err => {
        if (err instanceof Discord.DiscordAPIError){
            debug.error("API error when trying to change my own avatar picture.", err.stack);
        }
        message.channel.send("Hmm, Discord wasn't a big fan of that URL you gave me there, go check the logs.");
    })

}