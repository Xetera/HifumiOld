const Discord = require('discord.js');
const fs = require('fs');
const errors = require('./Errors');
const debug = require('../../Debug').debug;

generateOutputFile = function(channel, member) {
    // use IDs instead of username cause some people have stupid emojis in their name
    const fileName = `./recordings/${channel.id}-${member.id}-${Date.now()}.raw`;
    return fs.createWriteStream(fileName);
};

/**
 *
 * @param {Discord.Message} message
 */
const joinChannel = function(message, alexa){
    let voiceChannel = message.member.voiceChannel;
    voiceChannel.join() /*.then(conn => {
        const receiver = conn.createReceiver();
        conn.on('speaking', (user, speaking) => {
            if (speaking) {
                message.channel.send(`I'm listening to user`);
                // this creates a 16-bit signed PCM, stereo 48KHz PCM stream.
                const audioStream = receiver.createPCMStream(user);
                // create an output stream so we can dump our data in a file
                let outputStream= fs.createWriteStream('./recordings/audiotest.raw');
                // pipe our audio data into the file stream
                audioStream.pipe(outputStream);

                outputStream.on("data", console.log);
                // when the stream ends (the user stopped talking) tell the user
                audioStream.on('end', () => {
                    message.channel.send(`I'm no longer listening to user`);
                    outputStream.end();
                    alexa.transcribeAudio('audiotest.raw', message.channel);
                });
            }
        });
    })
*/
        .catch(err => {
            if (err.message === Enum.VOICE_ERROR.PERMISSION_ERROR) {
                message.channel.send(`No permission to join room ${message.member.voiceChannel.name}`)
            }
        });
};


/**
 *
 * @param {Discord.Message} dispatch
 */

const changeVolume = function(dispatch){
    //dispatch.
};

/**
 *
 * @param {Discord.Message} message
 */
const pause = function(message){
    let connection = getConnection(message);
    if (!connection.speaking){
        return message.channel.send('`Could not pause, player is already paused.`')
    }
    connection.dispatcher.pause();
};

const resume = function(message){
    let connection = getConnection(message);
    if (connection instanceof errors.NotVoiceConnected) return;
    if (connection.speaking){
        return message.channel.send('`Could not resume, already playing music.`')
    }
    connection.dispatcher.resume();
};

const disconnect = function(message){

};

/**
 *
 * @param {Discord.Message} message
 */
const getConnection = function(message){
    if(!message.guild.voiceConnection){
        debug.warning('Tried to execute voice command but voiceConnection was missing.');
        return errors.NotVoiceConnected;
    }
    else{
        return message.guild.voiceConnection;
    }
};

module.exports = {
    joinChannel: joinChannel,
    changeVolume: changeVolume,
    pause: pause,
    resume: resume,
    disconnect: disconnect
};