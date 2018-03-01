import * as Discord from 'discord.js'
import {debug} from '../../utility/Logging'

export default function setName(message : Discord.Message, name : string){
    const me : Discord.ClientUser = message.client.user;
    const oldName = me.username;
    if (name === '' || name === undefined)
        return
    return me.setUsername(name).then(response => {
        return debug.info(`Changed my name from ${oldName} to ${response.username}.`);
    }).catch (err => {
        if (err instanceof Discord.DiscordAPIError) {
            return debug.error("API error when trying to change my own username.", err.stack);
        }
    })
}