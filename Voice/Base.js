const Discord = require('discord.js');
const fs = require('fs');

exports.generateOutputFile = function(channel, member) {
    // use IDs instead of username cause some people have stupid emojis in their name
    const fileName = `./recordings/${channel.id}-${member.id}-${Date.now()}.pcm`;
    return fs.createWriteStream(fileName);
};

/**
 *
 * @param {Discord.Message} message
 */
const joinChannel = function(message){
    let voiceChannel = getConnection(message);
    voiceChannel.join()
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
    if (connection.speaking){
        return message.channel.send('`Could not resume, already playing music.`')
    }
    connection.dispatcher.resume();
};

/**
 *
 * @param {Discord.Message} message
 */
const getConnection = function(message){
    return message.guild.voiceConnection;
};

module.exports = {
    joinChannel: joinChannel,
    changeVolume: changeVolume,
    pause: pause,
    resume: resume
};