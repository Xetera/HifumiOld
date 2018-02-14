import * as Discord from 'discord.js'

function testFunction(message: Discord.Message){
    message.channel.send('hello');
}

export {testFunction}