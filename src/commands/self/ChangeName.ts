///<reference path="../namespace.ts"/>
import * as Discord from 'discord.js'
import {debug} from '../../utility/Logging'

export function setName(message : Discord.Message, input: [string]){
    const me : Discord.ClientUser = message.client.user;
    const oldName = me.username;
    const [name] = input;
    return me.setUsername(name).then(response => {
        debug.info(`Changed my name from ${oldName} to ${response.username}.`);
        return message.channel.send(`Changed my name from ${oldName} to ${response.username}.`)
    }).catch (err => {
        if (err instanceof Discord.DiscordAPIError) {
            return debug.error("API error when trying to change my own username.", err.stack);
        }
    })
}


