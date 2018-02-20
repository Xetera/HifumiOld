import * as Discord from 'discord.js'
import {debug} from '../../Utility/Logging'

export default function changePicture(me : Discord.ClientUser, URL : string){
    return new Promise(function (resolve, reject) {
        try {
            me.setAvatar(URL).then(response => {
                debug.info(`${response.username} avatar successfully changed!.`);
                resolve();
            });
        } catch (err) {
            if (err instanceof Discord.DiscordAPIError){
                debug.error("API error when trying to change my own avatar picture.", err);
                reject(err);
            }
        }
    });
}