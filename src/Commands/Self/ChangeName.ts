import * as Discord from 'discord.js'
import {debug} from '../../Utility/Logging'

export function changeName(me : Discord.ClientUser, name : string){
    const oldName = me.username;
    return new Promise(function (resolve, reject) {
        try {
            me.setUsername(name).then(response => {
                debug.info(`Changed my name from ${oldName} to ${response.username}.`);
                resolve();
            });
        } catch (err) {
            if (err instanceof Discord.DiscordAPIError){
                debug.error("API error when trying to change my own username.", err);
                reject(err);
            }
        }
    });
}